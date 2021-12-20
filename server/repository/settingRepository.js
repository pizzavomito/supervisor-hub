const DB = require("../db");
module.exports = class SettingRepository extends DB {

  constructor() {
    super('settings', {notifiers: [], categories: []})
  }

  add(key, data) {
    return super.upsert(data, key)
  }

  delete(key, id) {
    return super.delete(id, key)
  }

  findAll(key) {
    return this.db.get(key).value()
  }

  find(key, id) {
    return this.db.get(key).find({id}).value()
  }
}
