const notifiersRouter = require('./router/notifiers')

module.exports = ({Router, NotifierService}) => {
  const router = Router()

  router.get('/', function (req, res, next) {
    res.json({
      api: true
    })
  })
    .use('/notifiers', notifiersRouter({Router, NotifierService}))

  return router
}
