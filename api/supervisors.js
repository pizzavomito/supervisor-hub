const supervisorsRouter = require('./router/supervisors')

module.exports = ({Router, SupervisorService}) => {
  const router = Router()

  router.get('/', function (req, res, next) {
    res.json({
      api: true
    })
  })
    .use('/supervisors', supervisorsRouter({Router, SupervisorService}))


  return router
}
