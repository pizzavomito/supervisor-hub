<script>
import {state} from "~/lib/store/store";
export default {
  data: () => {
    return {
      defaultItem: {
        id: null,
        name: '',
        color: '#ffffff'
      }
    }
  },
  computed: {
    categories() {
      return state.categories
    }
  },
  methods: {
    cancel() {
      this.$refs.form.reset()
    },
    save() {
      this.$axios.post('/api/categories', this.editedItem)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
      this.$emit('save')
    },
    getCategory(categoryId) {
      return this.categories.find(x => x.id === categoryId)
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(x => x.id === categoryId)
      if (category) {
        return category.name
      }
      return ''
    },
    getCategoryColor(categoryId) {
      const category = this.categories.find(x => x.id === categoryId)
      if (category) {
        return category.color
      }
      return 'default'
    },
  }
}
</script>

