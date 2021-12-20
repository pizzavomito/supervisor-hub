const EventEmitter = require('events')
const Events = require("./events")
const SUPERVISOR = 'supervisor.'
const NOTIFIER = 'notifier.'
module.exports = class Store extends EventEmitter {

  constructor({events}) {
    super();
    this.events = events
    this.map = new Map()

    events.on(Events.ON_DELETE_NOTIFIER, (id) => {
      this.deleteNotifier(id)
    })

    events.on(Events.ON_ADD_NOTIFIER, (notifier) => {
      this.setNotifier(notifier.id, notifier)
    })

    events.on(Events.ON_DELETE_SUPERVISOR, (id) => {
      this.deleteSupervisor(id)
    })

    events.on(Events.ON_ADD_SUPERVISOR, (supervisor) => {
      this.setSupervisor(supervisor.id, supervisor)
    })
  }

  static get SUPERVISOR() {
    return SUPERVISOR
  }

  static get NOTIFIER() {
    return NOTIFIER
  }

  get(key) {
    return this.map.get(key)
  }

  has(key) {
    return this.map.has(key)
  }

  set(key, value) {
    this.map.set(key, value)
    this.emit('update')
  }

  delete(key) {
    this.map.delete(key)
    this.emit('update')
  }

  getSupervisor(key) {
    return this.map.get(SUPERVISOR+key)
  }

  hasSupervisor(key) {
    return this.map.has(SUPERVISOR+key)
  }

  setSupervisor(key, value) {
    this.map.set(SUPERVISOR+key, value)
    this.emit('update')
  }

  deleteSupervisor(key) {
    this.map.delete(SUPERVISOR+key)
    this.emit('update')
  }

  getNotifier(key) {
    return this.map.get(NOTIFIER+key)
  }

  hasNotifier(key) {
    return this.map.has(NOTIFIER+key)
  }

  setNotifier(key, value) {
    this.map.set(NOTIFIER+key, value)
    this.emit('update')
  }

  deleteNotifier(key) {
    this.map.delete(NOTIFIER+key)
    this.emit('update')
  }
}
