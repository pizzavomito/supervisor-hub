'use strict'

const Worker = require('../worker')
const NotifierFactory = require("../notifierFactory")

class GetAllProcessInfo extends Worker {
  constructor() {
    super()
    setInterval(() => {
      this.execute()
    }, this.interval || 30000)
  }

  execute() {
    console.log('start getAllProcessInfo', this.supervisor.id)

    if (!this.check()) {
      return
    }

    this.supervisor = this.currentSupervisor

    this.client.getState((error, state) => {
      const process = []
      if (error) {
        console.log(error)
        if (this.supervisor.alarmConnectionFailed) {
          this.notify(error)
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
            const msg = errors.length+' error(s).'
            this.notify(msg)
          }

        }
        this.postMessage({id: this.supervisor.id, process, state, error})
      })
    })

  }

  notify(msg) {
    this.supervisor.notifiers.forEach(notifierId => {
      const notifierConfig = this.notifiers.find(x => x.id === notifierId)
      if (typeof notifierConfig !== 'undefined') {
        const notifierInstance = NotifierFactory.create(notifierConfig)
        notifierInstance.supervisor = this.supervisor
        notifierInstance.notifyError(msg)
      }
    })
  }
}
// eslint-disable-next-line no-new
new GetAllProcessInfo()
