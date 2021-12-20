<template>

      <v-form ref="supervisorForm"
            v-model="formState">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="editedItem.name"
              :rules="nameRules"
              label="Name*"
              outlined
              rounded
              dense
              required
            ></v-text-field>

            <v-text-field
              v-model="editedItem.host"
              :rules="hostRules"
              label="Host*"
              outlined
              rounded
              dense
              required
            ></v-text-field>

            <v-text-field
              v-model="editedItem.port"
              :rules="portRules"
              label="Port*"
              outlined
              rounded
              dense
              required
            ></v-text-field>

            <v-text-field
              v-model="editedItem.username"
              label="Username"
              outlined
              rounded
              dense
            ></v-text-field>

            <v-text-field
              v-model="editedItem.password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              outlined
              rounded
              dense
              @click:append="showPassword = !showPassword"
            ></v-text-field>

            <v-textarea
              v-model="editedItem.description"
              label="Description"
              outlined
              rounded
              dense
              no-resize
            ></v-textarea>

          </v-col>
        </v-row>
      </v-form>

</template>

<script>

export default {
  name: "SupervisorForm",
  props: {
    item: {
      type: Object,
      required: false,
      default: null
    }
  },
  data: () => ({
      showPassword: false,
      formState: false
    }
  ),
  computed: {
    nameRules () {
      return [v => !!v || 'Nom est requis']
    },
    hostRules () {
      return [v => !!v || 'Host est requis']
    },
    portRules () {
      return [v => !!v || 'Port est requis']
    },
    _item: {
      get() {
        return this.item
      },
      set(value) {
        this.$emit('update:item', value)
      }
    },
    editedItem: {
      get() {
        return this._item ? this._item : this.defaultItem
      },
      set(value) {
        this.$emit('update:item', value)
      }
    }
  },
  watch: {
    formState(value) {
      this.$emit('form-state', value)
    }
  },
  methods: {
    cancel() {
      this.$refs.supervisorForm.reset()
    }
  }
}
</script>

<style scoped>

</style>
