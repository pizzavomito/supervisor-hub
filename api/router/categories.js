
module.exports = ({ Router, CategoryService}) => {
  const router = Router()
  router
    .get('/', (req, res, next) => {
      res.json(CategoryService.findAll())
    })
    .get('/:id', (req, res, next) => {
      res.json(CategoryService.find(req.params.id))
    })
    .post('/', (req, res) => {
      const category = CategoryService.add(req.body)
      // io.emit('categories.change', category)
      res.json(category)
    })
    .delete('/:id', (req, res) => {
      CategoryService.delete(req.params.id)
      // Store.deleteCategory(req.params.id)
      // io.emit('categories.list', SettingRepository.findAll('categories'))
      res.json(req.body)
    })

  return router
}
