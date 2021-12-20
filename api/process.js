const processRouter = require('./router/process')

module.exports = ({Router, Cache}) => {
  const router = Router()

  router.get('/', function (req, res, next) {
    res.json({
      api: true
    })
  })
    .use('/process', processRouter({Router, Cache}))

  return router
}
