
module.exports = ({ Router, Cache}) => {
  const router = Router()
  router
    .get('/:id', function(req, res, next) {
      res.json(Cache.getSupervisor(req.params.id+'.process'))
    })
  return router
}
