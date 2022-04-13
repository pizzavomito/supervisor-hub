<template>
  <v-app v-cloak v-if="ready">
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
      stateless
      width="312"
    >
      <v-list two-line class="overflow-y-auto" height="840" shaped avatar>
        <v-list-item-group v-model="selectedItem">
          <template  v-for="supervisor in supervisors">
          <v-list-item :key="supervisor.id" nuxt link exact :to="'/supervisor?id='+supervisor.id">
            <template #default="{ active }">
            <v-list-item-avatar>
              <v-icon v-if="supervisor.enable && !supervisor.error && supervisor.countAlarm === 0" color="default"
                      class="success">mdi-check
              </v-icon>
              <v-icon v-else-if="!supervisor.enable" color="default" class="grey lighten-1">mdi-power-plug-off-outline
              </v-icon>

              <v-icon v-else-if="supervisor.countAlarm > 0" color="default" class="error">mdi-bell-ring-outline
              </v-icon>
              <v-icon v-else-if="supervisor.error" color="default" class="error">mdi-exclamation</v-icon>
            </v-list-item-avatar>
              <v-list-item-icon>
                <v-icon
                  v-if="active"
                  color="grey lighten-1"
                >
                  mdi-star-outline
                </v-icon>
              </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ supervisor.name }}</v-list-item-title>
              <v-list-item-subtitle>Processes: {{ supervisor.countProcess }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                <v-icon v-if="supervisor.notifiers.length > 0" small color="warning">mdi-send-circle-outline</v-icon>
                <category-label v-if="supervisor.category" :category-id="supervisor.category"></category-label>
              </v-list-item-action-text>
            </v-list-item-action>
            </template>
          </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      clipped-left
      fixed
      app
      dense
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"/>
      <v-toolbar-title v-text="title"/>
      <v-spacer/>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn small text @click="$router.push('/')">
          <v-icon left>mdi-apps</v-icon>
          dashboard
        </v-btn>
        <v-btn small text @click="openParametersForm = true">
          <v-icon left>mdi-cog-outline</v-icon>
          parameters
        </v-btn>
      </v-toolbar-items>
      <v-btn icon @click="toggleDarkMode">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-menu>
        <template #activator="{ attrs, on }">
          <v-btn icon small v-bind="attrs" class="my-2 hidden-md-and-up"
                 v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list dense>
          <v-list-item @click="$router.push('/')">
            <v-list-item-icon>
              <v-icon small>mdi-apps</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item @click="openSupervisorForm = true">
            <v-list-item-icon>
              <v-icon small>mdi-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Add a supervisor</v-list-item-title>
          </v-list-item>

          <v-list-item @click="openParametersForm = true">
            <v-list-item-icon>
              <v-icon small>mdi-cog-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Parameters</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-banner
        v-if="connectionError"
        color="error"
        single-line
        tile
      >Cannot connect to the server
      </v-banner>
      <v-container fluid>
        <Nuxt/>
      </v-container>
    </v-main>

    <parameters-dialog :open.sync="openParametersForm"></parameters-dialog>
  </v-app>
  <v-app v-else>
    <v-container fluid>

    </v-container>
  </v-app>
</template>

<script>

import categoryHelperMixin from "../components/categories/mixins/categoryHelperMixin";

import CategoryLabel from "../components/categories/CategoryLabel";
import ParametersDialog from "../components/ParametersDialog";
import {state, methods} from '~/lib/store/store'

export default {
  components: {ParametersDialog, CategoryLabel},
  mixins: [categoryHelperMixin],
  data() {
    return {
      openParametersForm: false,
      connectionError: false,
      items: [],
      drawer: null,
      ready: false,
      title: 'Supervisor Hub',
      selectedItem: 1
    }
  },
  computed: {
    supervisors() {
      return state.supervisors
    }
  },
  watch: {
    drawer(value) {
      localStorage.setItem("drawer", value.toString())
    }
  },
  async created() {
    this.$socket.on('disconnect', error => {
      this.connectionError = error
    })
    this.$socket.on('connect', () => {
      this.connectionError = false
    })
    if (process.client) {
      const drawer = localStorage.getItem("drawer")
      if (drawer) {
        if (drawer === "true") {
          this.drawer = true
        } else {
          this.drawer = false
        }
      }
      const theme = localStorage.getItem("dark_theme")
      if (theme) {
        if (theme === "true") {
          this.$vuetify.theme.dark = true
        } else {
          this.$vuetify.theme.dark = false
        }
      } else if (
        // eslint-disable-next-line nuxt/no-globals-in-created
        window.matchMedia &&
        // eslint-disable-next-line nuxt/no-globals-in-created
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        this.$vuetify.theme.dark = true
        localStorage.setItem(
          "dark_theme",
          this.$vuetify.theme.dark.toString()
        )
      }
    }

    const notifiers = await this.$axios.get('/api/notifiers')
    methods.onNotifiersList(notifiers.data)

    const categories = await this.$axios.get('/api/categories')
    methods.onCategoriesList(categories.data)

    const supervisors = await this.$axios.get('/api/supervisors')
    methods.onSupervisorsList(supervisors.data)

    this.ready = true

    this.$socket.on('supervisors.change', methods.onSupervisorsChange)
    this.$socket.on('supervisors.list', methods.onSupervisorsList)

    this.$socket.on('notifiers.change', methods.onNotifiersChange)
    this.$socket.on('notifiers.list', methods.onNotifiersList)

    this.$socket.on('categories.change', methods.onCategoriesChange)
    this.$socket.on('categories.list', methods.onCategoriesList)
  },
  mounted() {
  },
  methods: {
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      localStorage.setItem("dark_theme", this.$vuetify.theme.dark.toString());
    }
  }
}
</script>

<style>
/*body {*/
/*  font-weight: 300 !important;*/
/*}*/
[v-cloak] {
  display: none;
}

.theme--dark {

::-webkit-scrollbar-thumb {
  background: #ddd;
}

::-webkit-scrollbar-track {
  background: #666;
}

}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: #ddd;
}

::-webkit-scrollbar-thumb {
  background: #666;
}


</style>
