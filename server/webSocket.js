const Events = require("./events");
const {NotifierService, CategoryService, SupervisorService} = require("./")
const supervisord = require("supervisord");
module.exports = class IO {
  constructor({io, events}) {
    this.io = io
    this.events = events

    this.events.on(Events.ON_ADD_NOTIFIER,(notifier) => {
      this.io.emit('notifiers.change', notifier)
    })
    this.events.on(Events.ON_DELETE_NOTIFIER,() => {
      this.io.emit('notifiers.list', NotifierService.findAll())
    })

    this.events.on(Events.ON_ADD_CATEGORY,(category) => {
      this.io.emit('categories.change', category)
    })
    this.events.on(Events.ON_DELETE_CATEGORY,() => {
      this.io.emit('categories.list', CategoryService.findAll())
    })

    this.events.on(Events.ON_ADD_SUPERVISOR,(supervisor) => {
      this.io.emit('supervisors.change', supervisor)
    })
    this.events.on(Events.ON_DELETE_SUPERVISOR,() => {
      this.io.emit('supervisors.list', SupervisorService.findAll())
    })

    this.io.on('connection', socket => {
      console.log('Socket Connect:', {id: socket.id})

      socket.on('join.supervisor', (id) => {
        console.log('join ', id)
        socket.join(id)
      })

      socket.on('leave.supervisor', (id) => {
        console.log('leave ', id)
        socket.leave(id)
      })

      socket.on('action.stop', (processus, id) => {
        console.log('action.stop:', id)
        // socket.broadcast.emit('action.stop', {id, group:processus.group, name: processus.name})
        // io.emit('chat-message', {id: socket.id, message: msg})
        const supervisor = SupervisorRepository.find(id)
        console.log(supervisor.host)
        const client = supervisord.connect(supervisor.host)
        client.stopProcess(processus.group+':'+processus.name, false,(err, result) => {
          console.log(err, result)
          Jobs.execute(id)
        })

      })

      socket.on('action.start', (processus, id) => {
        console.log('action.start:', id)
        // socket.broadcast.emit('action.start', {id, group:processus.group, name: processus.name})
        // io.emit('chat-message', {id: socket.id, message: msg})
        const supervisor = SupervisorRepository.find(id)
        const client = supervisord.connect(supervisor.host)
        client.startProcess(processus.group+':'+processus.name, false, (err, result) => {
          console.log(err, result)
          Jobs.execute(id)
        })

      })

      socket.on('action.restart', (processus, id) => {
        console.log('action.restart:', id)
        // socket.broadcast.emit('action.restart', {id, group:processus.group, name: processus.name})
        // io.emit('chat-message', {id: socket.id, message: msg})
        const supervisor = SupervisorRepository.find(id)
        const client = supervisord.connect(supervisor.host)

        client.stopProcess(processus.group+':'+processus.name, false, (err, result) => {
          console.log(err, result)
          Jobs.execute(id)
          client.startProcess(processus.group+':'+processus.name, false, (err, result) => {
            console.log(err, result)
            Jobs.execute(id)
          })
        })

      })

      socket.on('action.startAll', (id) => {
        console.log('action.startAll:', id)
        // socket.broadcast.emit('action.startAll', id)
        // io.emit('chat-message', {id: socket.id, message: msg})
        const supervisor = SupervisorRepository.find(id)
        const client = supervisord.connect(supervisor.host)

        client.startAllProcesses((err, result) => {
          console.log(err, result)
          Jobs.execute(id)
        })

      })

      socket.on('action.stopAll', (id) => {
        console.log('action.stopAll:', id)
        // socket.broadcast.emit('action.stopAll', id)
        // io.emit('chat-message', {id: socket.id, message: msg})
        const supervisor = SupervisorRepository.find(id)
        const client = supervisord.connect(supervisor.host)

        client.stopAllProcesses((err, result) => {
          console.log(err, result)
          Jobs.execute(id)
        })

      })

      socket.on('action.restartAll', (id) => {
        console.log('action.restartAll:', id)
        // socket.broadcast.emit('action.restartAll', id)
        // io.emit('action.restartAll', id)
        const supervisor = SupervisorRepository.find(id)
        const client = supervisord.connect(supervisor.host)

        client.stopAllProcesses((err, result) => {
          console.log(err, result)
          Jobs.execute(id)
          client.startAllProcesses((err, result) => {
            console.log(err, result)
            Jobs.execute(id)
          })
        })


      })
    })
  }
}
