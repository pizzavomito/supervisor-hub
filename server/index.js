const Events = new (require('./events'))()

// EXPRESS
const http = require('http')
const express = require('express')
const app = express()
const { Router } = express
const server = http.createServer(app)
const socketio = require('socket.io')


// NUXT
const { Nuxt, Builder } = require('nuxt')
const config = require('../nuxt.config')

// API
const api = require('../api/')
const notifiersApi = require('../api/notifiers')
const categoriesApi = require('../api/categories')
const supervisorsApi = require('../api/supervisors')
const processApi = require('../api/process')

const SupervisorRepository = new (require('./repository/supervisorRepository'))()
const SettingRepository = new (require('./repository/settingRepository'))()


const CategoryService = new (require('./services/categoryService'))({repository: SettingRepository, events: Events})
exports.CategoryService = CategoryService
const NotifierService = new (require('./services/notifierService'))({repository: SettingRepository, events: Events})
exports.NotifierService = NotifierService
const SupervisorService = new (require('./services/supervisorService'))({repository: SupervisorRepository, events: Events})
exports.SupervisorService = SupervisorService

const Cache = new (require('./cache'))({events: Events})

// exports.SettingRepository = SettingRepository
// exports.SupervisorRepository = SupervisorRepository
exports.Cache = Cache


// WEBSOCKET
const WebSocket = new (require('./webSocket'))({io: socketio(server), events: Events})
exports.WebSocket = WebSocket


const Jobs = new (require('./jobs'))({events: Events})
exports.Jobs = Jobs

const supervisors = SupervisorService.findAll()

if (supervisors) {
  supervisors.forEach(supervisor => {
    Cache.setSupervisor(supervisor.id, supervisor)
  })
}

const notifiers = NotifierService.findAll()

if (notifiers) {
  notifiers.forEach(notifier => {
    Cache.setNotifier(notifier.id, notifier)
  })
}

Cache.set('notifierTypes', [
  {
    "key": "discord",
    "type": "webhook"
  },
  {
    "key": "slack",
    "type": "webhook"
  },
  {
    "key": "email",
    "type": "email"
  }
])

Jobs.start()

config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use('/api', api({ Router, io: WebSocket.io, SupervisorRepository, Cache, Jobs }))
  app.use('/api', supervisorsApi({ Router, SupervisorService }))
  app.use('/api', notifiersApi({ Router, NotifierService }))
  app.use('/api', categoriesApi({ Router, CategoryService }))
  app.use('/api', processApi({ Router, Cache }))
  // // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
  console.log({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()



