'use strict'

const Worker = require('../worker')

class GetState extends Worker {
  constructor() {
    super()
    setInterval(() => {
      this.execute()
    }, this.interval || 30000)
  }

  execute() {
    console.log('start getState', this.supervisor.id)
    if (!this.check()) {
      return
    }

    this.supervisor = this.currentSupervisor
    this.client.getState((error, state) => {

      if (error) {
        console.log(error)
      }

      this.postMessage({id: this.supervisor.id, state, error})
    })
  }
}

new GetState()

