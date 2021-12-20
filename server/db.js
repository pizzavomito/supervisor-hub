const path = require('path')
const FileSync = require('lowdb/adapters/FileSync')
const Low = require('lowdb')


module.exports = class DB {

  constructor(filename, defaultValue = []) {
    const file = path.join(__dirname, `../db/${filename}.json`)
    const adapter = new FileSync(file, {defaultValue})
    this.db = new Low(adapter)
  }

  upsert(data, key=null) {
    let result = false
    let subject = this.db.get()

    if (!data.id) {
      data.id = '_' + Math.random().toString(36).substr(2, 9)
    }

    if (key) {
      subject = this.db.get(key)
    }

    result = subject.find({id: data.id}).value()

    if (typeof result !== 'undefined') {
      subject.find({id: data.id}).assign(data).write()
      return data
    }

    subject.push(data).write()
    return data
  }

  delete(id, key=null) {

    const subject = this.db.data
    if (key) {
      this.db.get(key).remove({ id}).value()
      this.db.write()
      return this
    }

    delete subject[id]
    this.db.write()
    return this
  }

  read() {
    this.db.read()
    return this.db.data
  }

  write(data) {
    this.db.data = data
    this.db.write()
    return this
  }
}
