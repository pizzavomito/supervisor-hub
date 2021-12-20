<script>
export default {
  data: () => {
    return {}
  },
  mounted() {},
  methods: {
    onStop(supervisor, processId) {
      this.$axios.post(`/api/supervisors/${supervisor.id}/process/${processId}/stop`)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onStart(supervisor, processId) {
      this.$axios.post(`/api/supervisors/${supervisor.id}/process/${processId}/start`)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onTailLog(supervisor, processId) {
      this.$axios.post(`/api/supervisors/${supervisor.id}/process/${processId}/tailLog`)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onRestart(supervisor, processId) {
      this.$axios.post(`/api/supervisors/${supervisor.id}/process/${processId}/restart`)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onStartAll(supervisor) {
      this.$axios.post(`/api/supervisors/${supervisor.id}/startAll`)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onStopAll(supervisor) {
      this.$axios.post(`/api/supervisors/${supervisor.id}/stopAll`)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onRestartAll(supervisor) {
      this.$axios.post(`/api/supervisors/${supervisor.id}/restartAll`)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onToggleAlertAll(supervisor, value) {
      supervisor.alarmProcessError = value
      this.$axios.post('/api/supervisors', supervisor)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onRefresh(supervisor) {
      this.$axios.post(`/api/supervisors/${supervisor.id}/refresh`)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onEditSupervisor(supervisor) {
      this.currentSupervisor = supervisor
      this.openSupervisorForm = true
    },
    onDeleteSupervisor(supervisor) {
      this.currentSupervisor = supervisor
      this.openConfirmSupervisorDelete = true
    },
    onConfirmDeleteSupervisor() {
      this.$axios.delete(`/api/supervisors/${this.currentSupervisor.id}`)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
      this.openConfirmSupervisorDelete = false
      this.$emit('delete')
    },
    onToggleEnableListener(supervisor, value) {
      supervisor.enable = value
      this.$axios.post('/api/supervisors', supervisor)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onEnableNotification(supervisor) {
      supervisor.notification = true
      this.$axios.post('/api/supervisors', supervisor)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
    onDisableNotification(supervisor) {
      supervisor.notification = false
      this.$axios.post('/api/supervisors', supervisor)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
    },
  }
}
</script>
