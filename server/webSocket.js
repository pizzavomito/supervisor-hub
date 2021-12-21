const Events = require("./events");
const {NotifierService, CategoryService, SupervisorService} = require("./")

module.exports = class IO {
  constructor({io, events}) {
    this.io = io
    this.events = events

    this.events.on(Events.ON_ADD_NOTIFIER,(notifier) => {
      this.io.emit('notifiers.change', notifier)
    })
    this.events.on(Events.ON_DELETE_NOTIFIER,() => {
      this.io.emit('notifiers.list', NotifierService.findAll())
    })

    this.events.on(Events.ON_ADD_CATEGORY,(category) => {
      this.io.emit('categories.change', category)
    })
    this.events.on(Events.ON_DELETE_CATEGORY,() => {
      this.io.emit('categories.list', CategoryService.findAll())
    })

    this.events.on(Events.ON_ADD_SUPERVISOR,(supervisor) => {
      this.io.emit('supervisors.change', supervisor)
    })
    this.events.on(Events.ON_DELETE_SUPERVISOR,() => {
      this.io.emit('supervisors.list', SupervisorService.findAll())
    })

    this.io.on('connection', socket => {
      console.log('Socket Connect:', {id: socket.id})

      socket.on('join.supervisor', (id) => {
        console.log('join ', id)
        socket.join(id)
      })

      socket.on('leave.supervisor', (id) => {
        console.log('leave ', id)
        socket.leave(id)
      })
    })
  }
}
