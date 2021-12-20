<template>
  <div v-cloak v-if="supervisor.id">
    <v-row class="mt-0" no-gutters>
      <v-col sm="12" md="7" xl="6">
        <supervisor-dashcard :supervisor="supervisor" :show-tool-bar="true" :flat="true" @delete="onDeleteSupervisor">

          <template #config>

            <v-list>
              <v-subheader>Category</v-subheader>
              <v-list-item>
                <v-list-item-content>
<!--                  <v-list-item-title>Category</v-list-item-title>-->
                  <v-list-item-subtitle class="text-sm-caption">
                    Select a category to highlight the supervisor.
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-btn color="default" class="ml-4" x-small text
                       @click="openCategoryForm = true">
                  <v-icon left>mdi-plus</v-icon>
                  Create a category
                </v-btn>
              </v-list-item>
              <v-list-item>
                <v-chip-group v-model="categorySelected">
                  <v-chip v-for="category in categories" :key="category.id" :value="category.id" :color="category.color"
                          :outlined="category.id !== categorySelected" label small>
                    <v-icon v-if="category.id === categorySelected" small left>mdi-check-circle</v-icon>
                    {{ category.name }}
                  </v-chip>
                </v-chip-group>
              </v-list-item>
            </v-list>

            <v-list flat>
              <v-subheader>Alarms</v-subheader>
              <v-list-item>
                <v-list-item-content>
<!--                  <v-list-item-title>Alarms</v-list-item-title>-->
                  <v-list-item-subtitle class="text-sm-caption">Displays an alarm if a condition is satisfied.</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-action>
                  <v-switch v-model="supervisor.alarmConnectionFailed" inset dense color="success"
                            label="when the connection to the supervisor has failed"></v-switch>
                </v-list-item-action>
                <!--              <v-list-item-content>-->
                <!--                <v-list-item-title>when the connection to the supervisor has failed</v-list-item-title>-->
                <!--              </v-list-item-content>-->
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-switch v-model="supervisor.alarmProcessError" inset dense color="success"
                            label="when a process is in error"></v-switch>
                </v-list-item-action>
              </v-list-item>

            </v-list>
            <v-list flat>
              <v-subheader>Notifications</v-subheader>
              <v-list-item>
                <v-list-item-content>
<!--                  <v-list-item-title>Notifications</v-list-item-title>-->
                  <v-list-item-subtitle class="text-sm-caption">Send a notification when an alarm is triggered.</v-list-item-subtitle>
                </v-list-item-content>
                <v-btn color="default" class="ml-4" x-small text
                       @click="openNotifierForm = true">
                  <v-icon left>mdi-plus</v-icon>
                  Create a notification
                </v-btn>
              </v-list-item>
              <v-list-item-group
                v-model="notifiersSelected"
                multiple
              >
                <template v-for="item in notifiers">
                  <v-list-item
                    :key="item.id"
                    :value="item.id"
                  >
                    <template #default="{ active }">
                      <v-list-item-action>
                        <v-switch inset dense color="success"
                                  :input-value="active" :label="item.name"
                        ></v-switch>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-subtitle v-text="item.description"></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </template>
              </v-list-item-group>

            </v-list>
          </template>
        </supervisor-dashcard>


        <!--            <v-list-item-action>-->
        <!--              <v-btn color="default" class="ml-4" small text @click="$router.push('/')">-->
        <!--                <v-icon left>mdi-plus</v-icon>-->
        <!--                New-->
        <!--              </v-btn>-->
        <!--              <v-btn color="warning" class="ml-4" small text @click="$router.push('/')">-->
        <!--                <v-icon left>mdi-pause</v-icon>-->
        <!--                Pause-->
        <!--              </v-btn>-->
        <!--            </v-list-item-action>-->
        <!--          </v-list-item>-->
        <!--        </v-list>-->

      </v-col>
      <v-col sm="12" md="5" xl="6">
        <v-card flat tile>
          <v-toolbar flat dense>
            <v-spacer></v-spacer>
            <v-col md="6">
              <v-text-field
                v-model="query"
                hide-details
                prepend-icon="mdi-magnify"
                single-line
                outlined
                rounded
                dense
                label="Search"
              ></v-text-field>
            </v-col>
          </v-toolbar>

          <v-list v-if="filteredProcess.length > 0" two-line dense class="overflow-y-auto" :height="filteredProcess.length > 11?'840':''">
            <template v-for="(item) in filteredProcess">
              <v-list-item :key="item.group + item.name">
                <v-list-item-avatar v-if="item.action" size="20">
                  <v-icon color="info">mdi-update</v-icon>
                </v-list-item-avatar>
                <v-list-item-avatar v-else size="20">
                  <v-icon v-if="item.statename === 'RUNNING'" color="success">mdi-check-circle-outline</v-icon>
                  <v-icon v-else-if="item.statename === 'STARTING'" color="info">mdi-circle-slice-5</v-icon>
                  <v-icon
                    v-else-if="['STOPPED','STOPPING','EXITED'].includes(item.statename)"
                    color="warning">mdi-pause-circle-outline
                  </v-icon>
                  <v-icon v-else-if="['FATAL','UNKNOWN','BACKOFF'].includes(item.statename)" color="error">
                    mdi-alert-circle-outline
                  </v-icon>
                  <v-icon v-else color="error">mdi-help-circle</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ item.group }} : {{ item.name }}</v-list-item-title>

                  <v-list-item-subtitle v-if="item.spawnerr" class="error--text text-xs-subtitle-1"
                                        v-text="item.spawnerr"></v-list-item-subtitle>
                  <v-list-item-subtitle v-else class="text-caption"
                                        v-text="item.description"></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-col justify="right">
                    <v-btn x-small icon
                           :disabled="item.statename !== 'RUNNING' && item.statename !== 'STARTING'"
                           @click="onStop(supervisor, item.group+':'+item.name)">
                      <v-icon>mdi-pause-circle-outline</v-icon>
                    </v-btn>
                    <v-btn x-small icon
                           :disabled="item.statename === 'RUNNING' || item.statename === 'STARTING'"
                           @click="onStart(supervisor, item.group+':'+item.name)">
                      <v-icon>mdi-play-circle-outline</v-icon>
                    </v-btn>
                    <v-btn x-small icon
                           :disabled="item.statename !== 'RUNNING' && item.statename !== 'STARTING'"
                           @click="onRestart(supervisor, item.group+':'+item.name)">
                      <v-icon>mdi-restart</v-icon>
                    </v-btn>

                    <!--                    <v-btn-->
                    <!--                      v-if="supervisor.processAlarms && supervisor.processAlarms.includes(item.group+':'+item.name)"-->
                    <!--                      x-small-->
                    <!--                      icon-->
                    <!--                      @click="onAlertOff(item, supervisor)">-->
                    <!--                      <v-badge-->
                    <!--                        :value="hasAlarm(item, supervisor)"-->
                    <!--                        color="error"-->
                    <!--                        dot-->
                    <!--                        overlap-->
                    <!--                        bordered-->
                    <!--                      >-->
                    <!--                        <v-icon>mdi-bell-outline</v-icon>-->
                    <!--                      </v-badge>-->

                    <!--                    </v-btn>-->
                    <!--                    <v-btn v-else x-small icon @click="onAlertOn(item, supervisor)">-->
                    <!--                      <v-icon>mdi-bell-off-outline</v-icon>-->
                    <!--                    </v-btn>-->
                  </v-col>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>
      <v-dialog
        v-model="openNotifierForm"
        width="500"
      >
        <notifier-form :item="currentNotifier" @save="openNotifierForm = false"></notifier-form>
      </v-dialog>
      <category-form-dialog :item="currentCategory" :open.sync="openCategoryForm"></category-form-dialog>

    </v-row>
    <supervisor-form-dialog :open.sync="openSupervisorForm" :item="supervisor"></supervisor-form-dialog>
  </div>
</template>

<script>
import SupervisorDashcard from "../components/supervisors/SupervisorDashcard";
import {state} from "../lib/store/store";
import NotifierForm from "../components/notifiers/NotifierForm";
import CategoryForm from "../components/categories/CategoryForm";
import categoryHelperMixin from "../components/categories/mixins/categoryHelperMixin";
import SupervisorFormDialog from "../components/supervisors/SupervisorFormDialog";
import supervisorHelperMixin from "../components/supervisors/mixins/supervisorHelperMixin";
import CategoryFormDialog from "../components/categories/CategoryFormDialog";


export default {
  // eslint-disable-next-line vue/no-unused-components
  components: {CategoryFormDialog, SupervisorFormDialog, CategoryForm, NotifierForm, SupervisorDashcard},
  mixins: [categoryHelperMixin, supervisorHelperMixin],
  data: () => ({
    title: 'Supervisor',
    openNotifierForm: false,
    openCategoryForm: false,
    openSupervisorForm: false,
    currentNotifier: null,
    currentCategory: null,
    supervisorId: null,
    supervisor: {},
    process: [],
    query: '',
  }),
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    filteredProcess() {
      const filterKey = this.query && this.query.toLowerCase()
      const data = this.process
      if (filterKey) {
        return data.filter((row) => {
          return Object.keys(row).some((key) => {
            return String(row[key]).toLowerCase().includes(filterKey)
          })
        })
      } else {
        return this.process
      }
    },
    notifiers() {
      return state.notifiers
    },
    categories() {
      return state.categories
    },
    categorySelected: {
      get() {
        return this.supervisor.category
      },
      set(value) {
        this.supervisor.category = value
        if (typeof value === 'undefined') {
          this.supervisor.category = null
        }

        this.$axios.post('/api/supervisors', this.supervisor)
      }
    },
    notifiersSelected: {
      get() {
        return this.supervisor.notifiers
      },
      set(values) {
        this.supervisor.notifiers = []
        values.forEach(value => {
          let notifier = null
          if (value instanceof Object) {
            notifier = value.id
          } else {
            notifier = value
          }
          if (this.supervisor.notifiers.includes(notifier) === false) {
            this.supervisor.notifiers.push(notifier)
          }
        })

        this.$axios.post('/api/supervisors', this.supervisor)
      }

    }
  },
  watch: {
    async '$route.query'() {
      await this.load()
    }
  },
  async mounted() {
    await this.load()
  },
  beforeDestroy() {

    this.$socket.emit('leave.supervisor', this.supervisorId)
    this.supervisor = {}
    this.process = []
  },
  methods: {
    async load() {
      this.$socket.emit('leave.supervisor', this.supervisorId)
      this.supervisorId = this.$route.query.id
      this.process = []
      const supervisor = await this.$axios.get('/api/supervisors/' + this.$route.query.id)
      this.supervisor = supervisor.data
      const process = await this.$axios.get('/api/process/' + this.$route.query.id)
      this.process = process.data

      this.$socket.emit('join.supervisor', this.supervisorId)
      this.$socket.on('supervisor.change', (supervisor) => {
        // console.log(data)
        this.supervisor = supervisor
        this.process = supervisor.process
      })

    },
    hasAlarm(process, supervisor) {
      return ['FATAL', 'UNKNOWN', 'BACKOFF'].includes(process.statename) && supervisor.processAlarms.includes(process.group + ':' + process.name);
    },
    onDeleteSupervisor() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
