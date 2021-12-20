<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ formTitle }}</span>
    </v-card-title>
    <v-card-text>
      <v-select v-model="notifierTypeSelected" :items="notifierTypes" return-object item-text="key" :readonly="!!editedItem.id"  outlined
                rounded
                dense></v-select>
      <component :is="form" v-if="form" :item="editedItem" @form-state="formState = $event"></component>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
<!--      <v-btn-->
<!--        color="blue darken-1"-->
<!--        text-->
<!--        @click="cancel"-->
<!--      >-->
<!--        Cancel-->
<!--      </v-btn>-->
      <v-btn
        color="blue darken-1"
        text
        :disabled="!formState"
        @click="save"
      >
        Save
      </v-btn>
    </v-card-actions>

  </v-card>

</template>

<script>
export default {
  name: "NotifierForm",
  props: {
    // eslint-disable-next-line vue/require-default-prop
    item: {
      type: Object,
      required: false
    }
  },
  data: () => ({
    formState: false,
    form: null,
    notifierTypeSelected: null,
    notifierTypes: [],
    defaultItem: {
      id: null
    }
  }),
  computed: {
    formTitle () {
      return this.editedItem.id === null ? 'New' : 'Edit '+this.editedItem.name
    },
    editedItem () {
      return this.item ? this.item:this.defaultItem
    }
  },
  watch: {
    notifierTypeSelected() {
      this.onChangeNotifierType()
    },
    item() {
      this.findNotifierTypeSelected()
    }
  },
  mounted() {
    this.findNotifierTypeSelected()
  },
  methods: {
    cancel () {
      this.$refs.form.reset()
    },
    save () {
      this.editedItem.key = this.notifierTypeSelected.key
      this.$axios.post('/api/notifiers', this.editedItem)
        .then(console.log.bind(console, 'RESPONSE:'))
        .catch(console.error.bind(console, 'FAIL - onPost:'))
      this.$emit('save')
    },
    async findNotifierTypeSelected() {
      const response = await this.$axios.get('/api/notifierTypes')
      this.notifierTypes = response.data
      if (this.editedItem.id === null) {
        this.notifierTypeSelected = this.notifierTypes[0]
      } else {
        this.notifierTypeSelected = this.notifierTypes.find(x => x.key === this.editedItem.key)
      }
    },
    onChangeNotifierType() {
      if (this.notifierTypeSelected.type === 'webhook') {
        this.form = () => import("./WebhookForm.vue")
      } else if (this.notifierTypeSelected.type === 'email') {
        this.form = () => import("./EmailForm.vue")
      } else {
        this.form = () => import("./EmailForm.vue")
      }
    }
  }
}
</script>

