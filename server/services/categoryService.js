const Events = require("../events");
module.exports = class CategoryService {
  constructor({ repository, events }) {
    this.repository = repository
    this.events = events
  }

  findAll() {
    return this.repository.findAll('categories');
  }

  find(id) {
    return this.repository.find('categories', id)
  }

  add(data) {
    const category = this.repository.add('categories', data)
    this.events.emit(Events.ON_ADD_CATEGORY, category)
    return category
  }

  delete(id) {
    this.repository.delete('categories', id)
    this.events.emit(Events.ON_DELETE_CATEGORY, id)
  }
}
