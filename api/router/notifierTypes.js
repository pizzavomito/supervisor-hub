
module.exports = ({ Router, Cache}) => {
  const router = Router()
  router
    .get('/', (req, res, next) => {
      res.json(Cache.get('notifierTypes'))
    })

  return router
}
