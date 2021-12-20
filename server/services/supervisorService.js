const Events = require("../events");
const supervisordClient = require("../supervisordClient");

module.exports = class SupervisorService {
  constructor({ repository, events }) {
    this.repository = repository
    this.events = events

    this.events.on(Events.ON_DELETE_NOTIFIER, (id) => {
      const supervisors = this.repository.findBy({notifiers:[id]})
      if (supervisors) {
        supervisors.forEach((supervisor) => {
          supervisor.notifiers = supervisor.notifiers.filter(x => x !== id)
          this.add(supervisor)
        })
      }
    })

    this.events.on(Events.ON_DELETE_CATEGORY, (id) => {
      const supervisors = this.repository.findBy({category: id})
      if (supervisors) {
        supervisors.forEach((supervisor) => {
          supervisor.category = null
          this.add(supervisor)
        })
      }
    })
  }

  findAll() {
    return this.repository.findAll();
  }

  find(id) {
    return this.repository.find(id)
  }

  add(data) {
    data.countError = data.countError || 0
    data.countRunning = data.countRunning || 0
    data.countStopped = data.countStopped || 0
    data.processByStatename = data.processByStatename || {}
    data.at = data.at || new Date()
    data.countAlarm = data.countAlarm || 0
    data.countProcess = data.countProcess || 0
    data.process = []
    data.state = data.state || ''
    data.error = data.error || null

    const supervisor = this.repository.add(data)
    this.events.emit(Events.ON_ADD_SUPERVISOR, supervisor)
    return supervisor
  }

  delete(id) {
    this.repository.delete(id)
    this.events.emit(Events.ON_DELETE_SUPERVISOR, id)
  }

  executeProcessAction(supervisor, processId, action) {
    const client = supervisordClient(supervisor)

    switch(action) {
      case 'stop':
        client.stopProcess(processId, false, (err, result) => {
          console.log(err, result)
          this.events.emit(Events.ON_STOP_PROCESS_SUPERVISOR, supervisor, processId)
        })
        break
      case 'start':
        client.startProcess(processId, false, (err, result) => {
          console.log(err, result)
          this.events.emit(Events.ON_START_PROCESS_SUPERVISOR, supervisor, processId)
        })
        break
      case 'restart':
        client.stopProcess(processId, false, (err, result) => {
          console.log(err, result)
          this.events.emit(Events.ON_RESTART_PROCESS_SUPERVISOR, supervisor, processId)
          client.startProcess(processId, false, (err, result) => {
            console.log(err, result)
            this.events.emit(Events.ON_START_PROCESS_SUPERVISOR, supervisor, processId)
          })
        })
        break
      case 'tailLog':
        client.tailProcessStdoutLog(processId, 1, 1000,(err, result) => {
          console.log(err, result)
          // this.events.emit(Events.ON_START_PROCESS_SUPERVISOR, supervisor, processId)
        })
        break
    }
  }

  executeAction(supervisor, action) {
    const client = supervisordClient(supervisor)

    switch(action) {
      case 'startAll':
        // eslint-disable-next-line node/handle-callback-err
        client.startAllProcesses((err, result) => {
          // Jobs.execute(supervisor.id)
          this.events.emit(Events.ON_START_ALL_PROCESSES_SUPERVISOR, supervisor)
        })
        break
      case 'stopAll':
        // eslint-disable-next-line node/handle-callback-err
        client.stopAllProcesses((err, result) => {
          this.events.emit(Events.ON_STOP_ALL_PROCESSES_SUPERVISOR, supervisor)
        })
        break
      case 'restartAll':
        // eslint-disable-next-line node/handle-callback-err
        client.stopAllProcesses((err, result) => {
          // this.events.emit(Events.ON_STOP_ALL_PROCESSES_SUPERVISOR, supervisor)
          client.startAllProcesses((result) => {
            // Jobs.execute(supervisor.id)
            this.events.emit(Events.ON_START_ALL_PROCESSES_SUPERVISOR, supervisor)
          })
        })
        break
      case 'refresh':
        this.events.emit(Events.ON_REFRESH_SUPERVISOR, supervisor)
        break
    }

  }
}
