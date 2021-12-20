<template>
  <v-dialog
    v-model="_open"
    width="800"
    persistent
    scrollable
    transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar dense flat>

        <v-toolbar-title>Parameters</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            icon
            text
            @click="_open = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text style="height: 600px;">
        <!--      <v-list-->
        <!--        three-line-->
        <!--        subheader-->
        <!--      >-->
        <!--        <v-subheader>User Controls</v-subheader>-->
        <!--        <v-list-item>-->
        <!--          <v-list-item-content>-->
        <!--            <v-list-item-title>Content filtering</v-list-item-title>-->
        <!--            <v-list-item-subtitle>Set the content filtering level to restrict apps that can be downloaded-->
        <!--            </v-list-item-subtitle>-->
        <!--          </v-list-item-content>-->
        <!--        </v-list-item>-->
        <!--        <v-list-item>-->
        <!--          <v-list-item-content>-->
        <!--            <v-list-item-title>Password</v-list-item-title>-->
        <!--            <v-list-item-subtitle>Require password for purchase or use password to restrict purchase-->
        <!--            </v-list-item-subtitle>-->
        <!--          </v-list-item-content>-->
        <!--        </v-list-item>-->
        <!--      </v-list>-->
        <!--      <v-divider></v-divider>-->
<!--        <v-list-->
<!--          three-line-->
<!--          subheader-->
<!--        >-->
<!--          <v-subheader>General</v-subheader>-->

<!--        </v-list>-->
        <v-list dense>
          <v-subheader>Categories</v-subheader>

              <v-btn color="default" class="mb-4" x-small text
                     @click="onEditCategory(null)">
                <v-icon left>mdi-plus</v-icon>
                Create a category
              </v-btn>

          <v-list-item v-for="category in categories" :key="category.id">
            <v-list-item-avatar size="10">
              <v-chip :color="category.color"></v-chip>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ category.name }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-col>
                <v-btn x-small icon @click="onEditCategory(category)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn x-small icon @click="onDeleteCategory(category)">
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </v-col>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
        <v-list dense>
          <v-subheader>Notifications</v-subheader>
          <v-btn color="default" class="mb-4" x-small text
                 @click="onEditNotifier(null)">
            <v-icon left>mdi-plus</v-icon>
            Create a notification
          </v-btn>
            <v-list-item v-for="notifier in notifiers" :key="notifier.id">

            <v-list-item-content>

              <v-list-item-title>
                {{ notifier.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ notifier.key }}
              </v-list-item-subtitle>

            </v-list-item-content>
            <v-list-item-icon>
              <v-col>
                <v-btn x-small icon @click="onEditNotifier(notifier)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn x-small icon @click="onDeleteNotifier(notifier)">
                  <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
              </v-col>
            </v-list-item-icon>

          </v-list-item>
        </v-list>
      </v-card-text>
      <!--          <v-list-item>-->
      <!--            <v-list-item-action>-->
      <!--              <v-checkbox v-model="sound"></v-checkbox>-->
      <!--            </v-list-item-action>-->
      <!--            <v-list-item-content>-->
      <!--              <v-list-item-title>Sound</v-list-item-title>-->
      <!--              <v-list-item-subtitle>Auto-update apps at any time. Data charges may apply</v-list-item-subtitle>-->
      <!--            </v-list-item-content>-->
      <!--          </v-list-item>-->
      <!--          <v-list-item>-->
      <!--            <v-list-item-action>-->
      <!--              <v-checkbox v-model="widgets"></v-checkbox>-->
      <!--            </v-list-item-action>-->
      <!--            <v-list-item-content>-->
      <!--              <v-list-item-title>Auto-add widgets</v-list-item-title>-->
      <!--              <v-list-item-subtitle>Automatically add home screen widgets</v-list-item-subtitle>-->
      <!--            </v-list-item-content>-->
      <!--          </v-list-item>-->
      <!--        </v-list>-->
    </v-card>

    <category-form-dialog :item="currentCategory" :open.sync="openCategoryForm"></category-form-dialog>
    <v-dialog
      v-model="openNotifierForm"
      width="500"
    >
      <notifier-form :item="currentNotifier" @save="openNotifierForm = false"></notifier-form>
    </v-dialog>

  </v-dialog>
</template>

<script>
import categoryHelperMixin from "./categories/mixins/categoryHelperMixin";
import CategoryFormDialog from "./categories/CategoryFormDialog";
import NotifierForm from "./notifiers/NotifierForm";
import {state} from "~/lib/store/store";

export default {
  name: "ParametersDialog",
  components: {NotifierForm, CategoryFormDialog},
  mixins: [categoryHelperMixin],
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    currentCategory: null,
    openCategoryForm: false,
    currentNotifier: null,
    openNotifierForm: false
  }),
  computed: {
    notifiers() {
      return state.notifiers
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
    onEditCategory(category) {
      this.currentCategory = category
      this.openCategoryForm = true
    },
    onDeleteCategory(category) {
      this.$axios.delete('/api/categories/' + category.id)
    },
    onEditNotifier(notifier) {
      this.currentNotifier = notifier
      this.openNotifierForm = true
    },
    onDeleteNotifier(notifier) {
      this.$axios.delete('/api/notifiers/' + notifier.id)
    }
  }
}
</script>

<style scoped>

</style>
