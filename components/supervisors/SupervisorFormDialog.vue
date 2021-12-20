<template>
  <v-dialog
    v-model="_open"
    width="500"
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card>
    <v-toolbar v-if="showToolBar" dense flat>
      <v-toolbar-title>
        <span class="text-h5">{{ formTitle }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
      <v-btn  icon text @click="_open = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-card-text class="mt-4">
      <supervisor-form :item.sync="editedItem" @save="_open = false" @form-state="formState = $event"></supervisor-form>
    </v-card-text>

      <v-divider class="mt-2"></v-divider>
      <v-card-actions v-if="showActions">
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          :disabled="!formState"
          @click="onSave()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import SupervisorForm from "./SupervisorForm";
import supervisorFormMixin from "./mixins/supervisorFormMixin";

export default {
  name: "SupervisorFormDialog",
  components: {SupervisorForm},
  mixins: [supervisorFormMixin],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    item: {
      type: Object,
      required: false
    },
    showToolBar: {
      type: Boolean,
      default: true
    },
    showActions: {
      type: Boolean,
      default: true
    },
    open: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
      formState: false
  }),
  computed: {
    editedItem() {
      return typeof this._item !== 'undefined'?this._item:this.defaultItem
    },
    formTitle() {
      return this.editedItem.id === null ? 'New Supervisor' : 'Edit ' + this.editedItem.name
    },
    _item: {
      get() {
        return this.item
      },
      set(value) {
        this.$emit('update:item', value)
      }
    },
    _open: {
      get() {
        return this.open
      },
      set(value) {
        this.$emit('update:open', value)
      }
    }
  },
  methods: {
    onSave() {
      this.save()
      this._open = false
    }
  }
}
</script>

<style scoped>

</style>
