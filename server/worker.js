'use strict'
const { parentPort, workerData } = require('worker_threads')
const supervisordClient = require('./supervisordClient')
const Cache = require('./cache')

module.exports = class Worker {
  cache = workerData.cache
  interval = workerData.interval
  notifiers = workerData.notifiers
  supervisor
  currentSupervisor
  client
  constructor() {

    parentPort.on('message', data => {
      if (data === 'stop') {
        process.exit()
      }

      if (data === 'execute') {
        this.execute()
      }

      if (data.cache) {
        this.cache = data.cache
      }
    })

    this.supervisor = this.cache.get(Cache.SUPERVISOR+workerData.id)

    const keys = this.cache.keys()
    for(const key of keys) {
      if (key.startsWith(Cache.NOTIFIER)) {
        this.notifiers.push(this.cache.get(key))
      }
    }

    this.execute()
  }

  check() {

    if (this.cache.has(Cache.SUPERVISOR+workerData.id) === false) {
      process.exit()
    }
    this.currentSupervisor = this.cache.get(Cache.SUPERVISOR+workerData.id)

    if (!this.currentSupervisor.enable) {
      return false
    }

    if (!this.client || this.supervisor.host !== this.currentSupervisor.host) {
      this.client = supervisordClient(this.currentSupervisor)
    }

    return true
  }

  postMessage(value) {
    parentPort.postMessage(value)
  }

}

