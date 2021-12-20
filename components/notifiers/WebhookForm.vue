<template>
  <form ref="form">
    <v-row>
      <v-col
        cols="12"
      >
        <v-form v-model="formState">
        <v-text-field
          v-model="editedItem.name"
          label="Name"
          outlined
          rounded
          dense
        ></v-text-field>

        <v-text-field
          v-model="editedItem.webhook"
          label="Webhook"
          :rules="urlRules"
          outlined
          rounded
          dense
        ></v-text-field>

        <v-switch
          v-model="editedItem.enable"
          inset
          color="success"
          label="Active"
          :value="true"
          hide-details
        ></v-switch>
        </v-form>
      </v-col>
    </v-row>
  </form>
</template>


<script>

export default {
  name: "NotifierWebhookForm",
  props: {
    // eslint-disable-next-line vue/require-default-prop
    item: {
      type: Object,
      required: false
    }
  },
  data: () => ({
      formState: false,
      defaultItem: {
        id: null,
        name: '',
        webhook: '',
        enable: true,
        key: 'discord'
      }
    }
  ),
  computed: {
    editedItem() {
      return this.item ? this.item : this.defaultItem
    },
    urlRules() {
      // eslint-disable-next-line prefer-regex-literals
      const r = new RegExp('^(http|https)://')
      return [
        v => !!v || 'Une url est requise',
        v => r.test(v || '') || 'Url doit commencer par http:// ou https://'
      ]
    },
  },
  watch: {
    formState(value) {
      this.$emit('form-state', value)
    }
  },
  methods: {
    // cancel() {
    //   this.$refs.form.reset()
    // },
    // save() {
    //   post('/api/notifiers', this.editedItem)
    //     .then(console.log.bind(console, 'RESPONSE:'))
    //     .catch(console.error.bind(console, 'FAIL - onPost:'))
    //   this.$emit('save')
    // },
  }
}
</script>
