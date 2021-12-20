
module.exports = ({ Router, NotifierService}) => {
  const router = Router()
  router
    .get('/', (req, res, next) => {
      res.json(NotifierService.findAll())
    })
    .get('/:id', (req, res, next) => {
      res.json(NotifierService.find(req.params.id))
    })
    .post('/', (req, res) => {
      let notifier = {}
      notifier = NotifierService.add(req.body)
      // Store.setNotifier(notifier.id, notifier)
      // JobsManager.start()
      // io.emit('notifiers.change', notifier)
      res.json(notifier)
    })
    .delete('/:id', (req, res) => {
      NotifierService.delete(req.params.id)
      // Store.deleteNotifier(req.params.id)
      // io.emit('notifiers.list', SettingRepository.findAll('notifiers'))
      res.json(req.body)
    })

  return router
}
