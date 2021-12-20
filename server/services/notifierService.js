const Events = require("../events");
module.exports = class NotifierService {
  constructor({ repository, events }) {
    this.repository = repository
    this.events = events
  }

  findAll() {
    return this.repository.findAll('notifiers');
  }

  find(id) {
    return this.repository.find('notifiers',id)
  }

  add(data) {
    const notifier = this.repository.add('notifiers', data)
    this.events.emit(Events.ON_ADD_NOTIFIER, notifier)
    return notifier
  }

  delete(id) {
    this.repository.delete('notifiers', id)
    this.events.emit(Events.ON_DELETE_NOTIFIER, id)
  }
}
