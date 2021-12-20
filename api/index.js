const supervisord = require('supervisord')

// const supervisorsRouter = require('./router/supervisors')
// const processRouter = require('./router/process')
// const notifiersRouter = require('./router/notifiers')
// const categoriesRouter = require('./router/categories')
const notifierTypesRouter = require('./router/notifierTypes')


module.exports = ({Router, io, SupervisorRepository, Cache, Jobs}) => {
  const router = Router()

  // router.get('/', function (req, res, next) {
  //   res.json({
  //     api: true
  //   })
  // })
  //   .use('/supervisors', supervisorsRouter({Router, io, SupervisorRepository, Store, JobsManager}))

  // router.get('/', function (req, res, next) {
  //   res.json({
  //     api: true
  //   })
  // })
  //   .use('/process', processRouter({Router, Store}))

  // router.get('/', function (req, res, next) {
  //   res.json({
  //     api: true
  //   })
  // })
  //   .use('/notifiers', notifiersRouter({Router, io, SettingRepository, Store, JobsManager}))

  // router.get('/', function (req, res, next) {
  //   res.json({
  //     api: true
  //   })
  // })
  //   .use('/categories', categoriesRouter({Router, io, SettingRepository, Store}))

  router.get('/', function (req, res, next) {
    res.json({
      api: true
    })
  })
    .use('/notifierTypes', notifierTypesRouter({Router, Cache}))



  return router
}
