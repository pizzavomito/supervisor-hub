const categoriesRouter = require('./router/categories')

module.exports = ({Router, CategoryService}) => {
  const router = Router()

  router.get('/', function (req, res, next) {
    res.json({
      api: true
    })
  })
    .use('/categories', categoriesRouter({Router, CategoryService}))

  return router
}
