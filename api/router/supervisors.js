
module.exports = ({ Router, SupervisorService}) => {
  const router = Router()
  router
    .get('/', (req, res, next) => {
      res.json(SupervisorService.findAll())
    })
    .get('/:id', (req, res, next) => {
      res.json(SupervisorService.find(req.params.id))
    })
    .post('/:id/:action', (req, res) => {
      const supervisor = SupervisorService.find(req.params.id)
      if (typeof supervisor === 'undefined') {
        res.status(404)
        res.send('Not found')
      }
      SupervisorService.executeAction(supervisor, req.params.action)
      res.status(202)
      res.json(supervisor)
    })
    .post('/:id/process/:processId/:action', (req, res) => {
      const supervisor = SupervisorService.find(req.params.id)
      if (typeof supervisor === 'undefined') {
        res.status(404)
        res.send('Not found')
      }
      SupervisorService.executeProcessAction(supervisor, req.params.processId, req.params.action)
      res.status(202)
      res.json(supervisor)
    })
    .post('/', (req, res) => {
      let supervisor = {}
      supervisor.processus = req.body.processus
      req.body.processus = []
      supervisor = SupervisorService.add(req.body)
      res.json(supervisor)
    })

    .delete('/:id', (req, res) => {
      SupervisorService.delete(req.params.id)
      // Store.deleteSupervisor(req.params.id)
      // io.emit('supervisors.list', SupervisorRepository.findAll())
      res.json(req.body)
    })

  return router
}
