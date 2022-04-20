'use strict'

const Worker = require('../worker')
const NotifierFactory = require("../notifierFactory")
const {workerData} = require("worker_threads");

class GetAllProcessInfo extends Worker {
  constructor() {
    super()
    setInterval(() => {
      this.execute()
    }, this.interval || 30000)
  }

  execute() {
    console.log('start getAllProcessInfo', this.supervisor.id)
    const arr = [1, 2, 3, 4, 5, 6, 9, 7, 8, 9, 10]
    arr.reverse()
    const used = process.memoryUsage().heapUsed / 1024 / 1024
    console.log(` getAllProcessInfo The script uses approximately ${Math.round(used * 100) / 100} MB`)

    if (!this.check()) {
      return
    }

    this.supervisor = this.currentSupervisor

    this.client.getState((error, state) => {
      const process = []
      if (error) {
        console.log(error)
        if (this.supervisor.notification === true && this.supervisor.alarmConnectionFailed === true) {
          this.notify(error.toString())
        }
        this.postMessage({id: this.supervisor.id, process, state, error})
        return
      }
      this.client.getAllProcessInfo((error, process) => {
        if (error) {
          console.log(error)
        }
        if (this.supervisor.notification === true && this.supervisor.notifiers.length > 0 && process) {
          const errors = process.filter(x => ['FATAL','UNKNOWN','BACKOFF'].includes(x.statename))

          if (errors.length > 0 && this.supervisor.alarmProcessError) {
            this.notify(errors)
          }

        }
        this.postMessage({id: this.supervisor.id, process, state, error})
      })
    })

  }

  notify(errors) {
    const msg = errors.length+' error(s).'
    this.supervisor.notifiers.forEach(notifierId => {
      const notifierConfig = this.notifiers.find(x => x.id === notifierId)
      if (typeof notifierConfig !== 'undefined') {
        const notifierInstance = NotifierFactory.create(notifierConfig)
        notifierInstance.supervisor = this.supervisor
        notifierInstance.notifyError(msg)
        notifierInstance.notify(errors)


      }
    })
  }
}
// eslint-disable-next-line no-new
new GetAllProcessInfo()
