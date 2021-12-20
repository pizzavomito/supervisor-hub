const EventEmitter = require('events')

const ON_DELETE_CATEGORY = 'onDeleteCategory'
const ON_ADD_CATEGORY = 'onAddCategory'

const ON_DELETE_NOTIFIER = 'onDeleteNotifier'
const ON_ADD_NOTIFIER = 'onAddNotifier'

const ON_DELETE_SUPERVISOR = 'onDeleteSupervisor'
const ON_ADD_SUPERVISOR = 'onAddSupervisor'

const ON_START_ALL_PROCESSES_SUPERVISOR = 'onStartAllProcessesSupervisor'
const ON_STOP_ALL_PROCESSES_SUPERVISOR = 'onStopAllProcessesSupervisor'
const ON_REFRESH_SUPERVISOR = 'onRefreshSupervisor'

const ON_STOP_PROCESS_SUPERVISOR = 'onStopProcessSupervisor'
const ON_START_PROCESS_SUPERVISOR = 'onStartProcessSupervisor'
const ON_RESTART_PROCESS_SUPERVISOR = 'onRestartProcessSupervisor'

module.exports = class Events extends EventEmitter {

  static get ON_DELETE_CATEGORY() {
    return ON_DELETE_CATEGORY
  }

  static get ON_ADD_CATEGORY() {
    return ON_ADD_CATEGORY
  }

  static get ON_DELETE_NOTIFIER() {
    return ON_DELETE_NOTIFIER
  }

  static get ON_ADD_NOTIFIER() {
    return ON_ADD_NOTIFIER
  }

  static get ON_DELETE_SUPERVISOR() {
    return ON_DELETE_SUPERVISOR
  }

  static get ON_ADD_SUPERVISOR() {
    return ON_ADD_SUPERVISOR
  }

  static get ON_REFRESH_SUPERVISOR() {
    return ON_REFRESH_SUPERVISOR
  }

  static get ON_START_ALL_PROCESSES_SUPERVISOR() {
    return ON_START_ALL_PROCESSES_SUPERVISOR
  }

  static get ON_STOP_ALL_PROCESSES_SUPERVISOR() {
    return ON_STOP_ALL_PROCESSES_SUPERVISOR
  }

  static get ON_STOP_PROCESS_SUPERVISOR() {
    return ON_STOP_PROCESS_SUPERVISOR
  }

  static get ON_START_PROCESS_SUPERVISOR() {
    return ON_START_PROCESS_SUPERVISOR
  }

  static get ON_RESTART_PROCESS_SUPERVISOR() {
    return ON_RESTART_PROCESS_SUPERVISOR
  }

}
