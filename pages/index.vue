<template>
  <v-row>
    <v-col sm="12" md="6" xl="6">
      <v-row>
        <v-col md="4" xl="4">
          <v-card>
            <div class="text-center text-sm-caption pt-2">Supervisor</div>
            <div class="text-center text-h5 overline pt-2">Total</div>
            <v-card-text class="text-h1 text-center"><strong>{{ supervisors.length }}</strong></v-card-text>
          </v-card>
        </v-col>
        <v-col md="4" xl="4">
          <v-card>
            <div class="text-center text-sm-caption pt-2">Supervisor</div>
            <div class="text-center text-h5 overline pt-2">Alarm</div>
            <v-card-text class="error--text text-h1 text-center">
              <strong>{{ countAllAlarm }}</strong></v-card-text>
          </v-card>
        </v-col>
        <v-col md="4" xl="4">
          <v-card>
            <div class="text-center text-sm-caption pt-2">Supervisor</div>
            <div class="text-center text-h5 overline pt-2">Error</div>
            <v-card-text class="error--text text-h1 text-center">
              <strong>{{ countAllError }}</strong></v-card-text>
          </v-card>
        </v-col>

      </v-row>
      <v-row>
        <v-col md="4" xl="4">
          <v-card>
            <div class="text-center text-sm-caption pt-2">Process</div>
            <div class="text-center text-h5 overline pt-2">Total</div>
            <v-card-text class="text-h1 text-center"><strong>{{ countAllProcess }}</strong></v-card-text>
          </v-card>
        </v-col>
        <v-col md="4" xl="4">
          <v-card>
            <div class="text-center text-sm-caption pt-2">Process</div>
            <div class="text-center text-h5 overline pt-2">Running</div>
            <v-card-text class="text-h1 text-center success--text"><strong>{{ countAllProcessRunning }}</strong>
            </v-card-text>
          </v-card>
        </v-col>
        <!--        <v-col md="4" xl="4">-->
        <!--          <v-card>-->
        <!--            <div class="text-center text-h5 pt-2">Stopped</div>-->
        <!--            <v-card-text class="text-h1 text-center warning&#45;&#45;text"><strong>{{ countAllProcessStopped }}</strong>-->
        <!--            </v-card-text>-->
        <!--          </v-card>-->
        <!--        </v-col>-->
        <v-col md="4" xl="4">
          <v-card>
            <div class="text-center text-sm-caption pt-2">Process</div>
            <div class="text-center text-h5 overline pt-2">Error</div>
            <v-card-text class="text-h1 text-center error--text"><strong>{{ countAllProcessError }}</strong>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
<!--      <v-row>-->
<!--        <v-col v-for="(supervisor, key) in supervisors" :key="key" cols="12" sm="12" md="6" xl="3">-->
<!--          <supervisor-dashcard :supervisor="supervisor"></supervisor-dashcard>-->
<!--        </v-col>-->
<!--      </v-row>-->
    </v-col>
    <v-col sm="12" md="6" xl="6">
      <v-card>
        <v-toolbar flat dense>
          <v-toolbar-items>
            <v-btn small text @click="openSupervisorForm = true">
              <v-icon left>mdi-plus</v-icon>
              add a supervisor
            </v-btn>
          </v-toolbar-items>

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
        <v-list three-line class="overflow-y-auto" avatar>
          <template v-for="(supervisor, index) in filteredSupervisors">
            <v-list-item :key="supervisor.id">
              <v-list-item-avatar>

                <v-icon v-if="supervisor.enable && !supervisor.error && supervisor.countAlarm === 0" color="default"
                        class="success" dark>mdi-check
                </v-icon>

                <v-icon v-else-if="!supervisor.enable" color="default" class="grey lighten-1" dark>
                  mdi-power-plug-off-outline
                </v-icon>

                <v-icon v-else-if="supervisor.error" color="default" class="error" dark>mdi-exclamation</v-icon>

                <v-icon v-else-if="supervisor.countAlarm > 0" color="default" class="error" dark>mdi-bell-ring-outline
                </v-icon>

              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ supervisor.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-sm-caption">
                  {{ moment(supervisor.at).fromNow(true) }} ago
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content>

                <v-list-item-title v-if="supervisor.enable && !supervisor.error">Processes:
                  {{ supervisor.countProcess }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-icon v-if="supervisor.notifiers.length > 0" small color="warning">mdi-send-circle-outline</v-icon>
                  <category-label v-if="supervisor.category" :category-id="supervisor.category"></category-label>
                </v-list-item-subtitle>
                <v-list-item-subtitle v-if="!supervisor.enable">Currently disabled</v-list-item-subtitle>

                <v-list-item-subtitle v-if="supervisor.error" class="error--text">{{
                    supervisor.error
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-content>

                <v-list-item-subtitle v-if="supervisor.enable && !supervisor.error && supervisor.countRunning > 0" class="success--text">Running :
                  {{ supervisor.countRunning }}
                </v-list-item-subtitle>
                <v-list-item-subtitle v-if="supervisor.enable && !supervisor.error && supervisor.countStopped > 0" class="warning--text">Stopped :
                  {{ supervisor.countStopped }}
                </v-list-item-subtitle>
                <v-list-item-subtitle v-if="supervisor.enable && !supervisor.error && supervisor.countError > 0" class="error--text">Error : {{
                    supervisor.countError
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>

                <!--              <v-btn class="ma-2" x-small icon :disabled="supervisor.enable === false" @click="onRefresh(supervisor)">-->
                <!--                <v-icon>mdi-refresh</v-icon>-->
                <!--              </v-btn>-->
                <v-col justify="right">
                  <v-btn icon small @click="onStopAll(supervisor)">
                    <v-icon>mdi-pause-circle-outline</v-icon>
                  </v-btn>
                  <v-btn icon small @click="onStartAll(supervisor)">
                    <v-icon>mdi-play-circle-outline</v-icon>
                  </v-btn>
                  <v-btn icon small @click="onRestartAll(supervisor)">
                    <v-icon>mdi-restart</v-icon>
                  </v-btn>
                  <!--                  <template v-if="supervisor.allAlarm">-->
                  <!--                    <v-badge-->
                  <!--                      :value="supervisor.countAlarm > 0"-->
                  <!--                      color="error"-->
                  <!--                      dot-->
                  <!--                      overlap-->
                  <!--                      bordered-->
                  <!--                    >-->
                  <!--                      <v-btn small icon @click="onToggleAlertAll(supervisor, false)">-->
                  <!--                        <v-icon>mdi-bell-outline</v-icon>-->
                  <!--                      </v-btn>-->
                  <!--                    </v-badge>-->
                  <!--                  </template>-->
                  <!--                  <v-btn v-else small icon @click="onToggleAlertAll(supervisor, true)">-->
                  <!--                    <v-icon>mdi-bell-off-outline</v-icon>-->
                  <!--                  </v-btn>-->
                  <v-btn class="ml-4" small icon nuxt :to="'/supervisor?id='+supervisor.id">
                    <v-icon>mdi-cog-outline</v-icon>
                  </v-btn>
                </v-col>
              </v-list-item-action>
            </v-list-item>
            <v-divider
              v-if="index < filteredSupervisors.length -1"
              :key="index"
            ></v-divider>
          </template>
        </v-list>
      </v-card>

    </v-col>
    <supervisor-form-dialog :open.sync="openSupervisorForm"></supervisor-form-dialog>
  </v-row>
  <!--    <v-row>-->
  <!--      <v-col v-for="(supervisor, key) in supervisors" :key="key" cols="12" sm="12" md="6" xl="3">-->
  <!--        <supervisor-dashcard :supervisor="supervisor"></supervisor-dashcard>-->
  <!--      </v-col>-->
  <!--    </v-row>-->

</template>

<script>

import moment from "moment";
import SupervisorFormDialog from "../components/supervisors/SupervisorFormDialog";
import CategoryLabel from "../components/categories/CategoryLabel";
import supervisorHelperMixin from "~/components/supervisors/mixins/supervisorHelperMixin";
import {state} from '~/lib/store/store'


export default {
  components: {CategoryLabel, SupervisorFormDialog},
  mixins: [supervisorHelperMixin],
  data: () => ({
    title: 'Dashboard',
    openSupervisorForm: false,
    query: '',
    moment
  }),
  computed: {
    filteredSupervisors() {
      const filterKey = this.query && this.query.toLowerCase()
      const data = this.supervisors
      if (filterKey) {
        return data.filter((row) => {
          return Object.keys(row).some((key) => {
            return String(row[key]).toLowerCase().includes(filterKey)
          })
        })
      } else {
        return this.supervisors
      }
    },
    supervisors() {
      return state.supervisors
    },
    countAllAlarm() {
      return this.supervisors.length === 0 ? 0 : this.supervisors.map(supervisor => supervisor.countAlarm).reduce((prev, next) => prev + next)
    },
    countAllError() {
      return this.supervisors.length === 0 ? 0 : this.supervisors.filter(supervisor => supervisor.error !== null).length
    },
    countAllProcess() {
      return this.supervisors.length === 0 ? 0 : this.supervisors.map(supervisor => supervisor.countProcess).reduce((prev, next) => prev + next)
    },
    countAllProcessRunning() {
      return this.supervisors.length === 0 ? 0 : this.supervisors.map(supervisor => supervisor.processByStatename && supervisor.processByStatename.RUNNING ? supervisor.processByStatename.RUNNING : 0).reduce((prev, next) => prev + next)
    },
    countAllProcessStopped() {
      return this.supervisors.length === 0 ? 0 : this.supervisors.map(supervisor => supervisor.processByStatename && supervisor.processByStatename.STOPPED ? supervisor.processByStatename.STOPPED : 0).reduce((prev, next) => prev + next)
    },
    countAllProcessError() {
      return this.supervisors.length === 0 ? 0 : this.supervisors.map(supervisor => supervisor.countError).reduce((prev, next) => prev + next)
    }
  },
  mounted() {

  },
  methods: {}
}
</script>
