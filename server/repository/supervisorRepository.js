const DB = require("../db");
module.exports = class SupervisorRepository extends DB {

  constructor() {
    super('supervisors', {supervisors: []})
  }

  add(data) {
    return super.upsert(data, 'supervisors')
  }

  delete(id) {
    return super.delete(id, 'supervisors')
  }

  findAll() {
    return this.db.get('supervisors').value()
  }

  find(id) {
    return this.db.get('supervisors').find({id}).value()
  }

  findBy(data) {
    return this.db.get('supervisors').filter(data).value()
  }
}
