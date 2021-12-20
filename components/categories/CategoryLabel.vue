<template>
  <v-chip class="ma-2" :color="item.color" label x-small>
    {{ item.name }}
  </v-chip>
</template>

<script>
import categoryHelperMixin from "./mixins/categoryHelperMixin";

export default {
  name: "CategoryLabel",
  mixins: [categoryHelperMixin],
  props:{
    category: {
      type: Object,
      required: false,
      default: null
    },
    categoryId: {
      type: String,
      required: false,
      default: null
    }
  },
  computed: {
    item() {
      console.log(this.categoryId, this.category, this.getCategory(this.categoryId))
      return this.category !== null?this.category:this.getCategory(this.categoryId)
    }
  }
}
</script>

<style scoped>

</style>
