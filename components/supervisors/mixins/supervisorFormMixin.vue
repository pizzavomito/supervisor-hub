<script>
export default {
  data: () => {
    return {
      defaultItem: {
        id: null,
        name: '',
        host: '',
        username: '',
        password: '',
        category: '',
        enable: true,
        notification: true,
        notifiers: [],
        alarmProcessError: false,
        alarmConnectionFailed: false,
        processAlarms: [],
        description: ''
      }
    }
  },
  mounted() {
    if (typeof this.item === 'undefined') {
      this._item = this.defaultItem
    }
  },
  methods: {
    cancel() {
      // this.$refs.form.reset()
      if (typeof this.item !== 'undefined') {
        this._item = this.defaultItem
      }
    },
    save() {
      this.$axios.post('/api/supervisors', this.editedItem)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
  }
}
</script>
