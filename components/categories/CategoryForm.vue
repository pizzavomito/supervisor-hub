<template>

  <v-form ref="categoryForm"
          v-model="formState">
    <v-row>
      <v-col
        cols="12"
      >
        <v-text-field
          v-model="editedItem.name"
          :rules="nameRules"
          label="Name*"
          outlined
          rounded
          dense
          required
        ></v-text-field>

        <v-color-picker
          v-model="editedItem.color"
          class="ma-2"
          show-swatches
        ></v-color-picker>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import categoryHelperMixin from "./mixins/categoryHelperMixin";

export default {
  name: "CategoryForm",
  mixins: [categoryHelperMixin],
  props: {
    // eslint-disable-next-line vue/require-default-prop
    item: {
      type: Object,
      required: false,
      default: null
    }
  },
  data: () => ({
      formState: false,
      swatches: [
        ['#FF0000', '#AA0000', '#550000'],
        ['#FFFF00', '#AAAA00', '#555500'],
        ['#00FF00', '#00AA00', '#005500'],
        ['#00FFFF', '#00AAAA', '#005555'],
        ['#0000FF', '#0000AA', '#000055'],
      ]
    }
  ),
  computed: {
    formTitle() {
      return this.editedItem.id === null ? 'New Category' : 'Edit ' + this.editedItem.name
    },
    editedItem: {
      get() {
        return this.item ? this.item : this.defaultItem
      },
      set(value) {
        this.$emit('update:item', value)
      }
    },
    nameRules() {
      return [v => !!v || 'Nom est requis']
    },
  },
  watch: {
    formState(value) {
      this.$emit('form-state', value)
    }
  }
}
</script>

<style scoped>

</style>
