<template>
  <v-card :flat="flat" tile>
    <v-toolbar v-if="showToolBar" dense flat>
      <v-toolbar-title>{{ supervisor.name }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu
        offset-y
      >
        <template #activator="{ attrs, on }">
          <v-btn class="my-2 hidden-lg-and-up" icon small v-bind="attrs"
                 v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item @click="onRefresh(supervisor)">
            <v-list-item-icon>
              <v-icon small>mdi-refresh</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Refresh</v-list-item-title>
          </v-list-item>
          <v-list-item @click="onEditSupervisor(supervisor)">
            <v-list-item-icon>
              <v-icon small>mdi-pencil</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Edit</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="supervisor.enable" @click="onToggleEnableListener(supervisor, false)">
            <v-list-item-icon>
              <v-icon small>mdi-power-plug-off-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Pause</v-list-item-title>
          </v-list-item>
          <v-list-item v-else @click="onToggleEnableListener(supervisor, true)">
            <v-list-item-icon>
              <v-icon small>mdi-power-plug-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Enable</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item link class="error--text" @click="onDeleteSupervisor(supervisor)">
            <v-list-item-icon>
              <v-icon small color="error">mdi-delete-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>
    <div v-if="supervisor.enable && !supervisor.error && supervisor.countAlarm === 0" class="text-center">
      <div class="grey--text ms-4 text-sm-caption">{{ moment(supervisor.at).fromNow(true) }} ago</div>
      <div class="ms-4">PROCESSES : {{ supervisor.countProcess }}</div>
      <v-icon color="success" size="100px">mdi-check-circle-outline</v-icon>
    </div>
    <div v-else-if="!supervisor.enable" class="text-center">
      <div class="grey--text ms-4 text-sm-caption">&nbsp;</div>
      <v-icon color="default" size="100px">mdi-power-plug-off-outline</v-icon>
    </div>
    <div v-else-if="supervisor.countAlarm > 0" class="text-center">
      <div v-if="!supervisor.error" class="grey--text ms-4 text-sm-caption">{{ moment(supervisor.at).fromNow(true) }}
        ago
      </div>
      <div v-if="!supervisor.error" class="ms-4">PROCESSES : {{ supervisor.countProcess }}</div>
      <v-icon color="error" size="100px">mdi-bell-ring-outline</v-icon>
    </div>
    <div v-else-if="supervisor.error" class="text-center">
      <v-icon color="error" size="100px">mdi-alert-circle-outline</v-icon>
    </div>
    <v-list>
      <v-list-item v-if="!supervisor.enable">
        <v-list-item-content>
          <v-alert outlined type="info" color="default" border="left" prominent text>
            Currently disabled
          </v-alert>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-else-if="supervisor.error">
        <v-list-item-content>
          <v-alert outlined type="error" border="left" prominent text>
            {{ supervisor.error }}
          </v-alert>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="supervisor.enable && !supervisor.error">
        <v-list-item-content>
          <v-col md="6">
            <template v-for="(item, key) in supervisor.processByStatename">
              <v-list-item-subtitle v-if="['STOPPED','STOPPING','EXITED', 'STARTING', 'RUNNING'].includes(key)"
                                    :key="key"
                                    :class="['STOPPED','STOPPING','EXITED'].includes(key)?'warning--text':key === 'STARTING'?'info--text':'success--text'">
                {{ key }} : {{ item }}
              </v-list-item-subtitle>
            </template>
          </v-col>
          <v-col md="2">
            <template v-for="(item, key) in supervisor.processByStatename">
              <v-list-item-subtitle v-if="['FATAL','UNKNOWN','BACKOFF'].includes(key)" :key="key" class="error--text">
                {{ key }} : {{ item }}
              </v-list-item-subtitle>
            </template>
          </v-col>
        </v-list-item-content>
        <v-list-item-action>
          <category-label v-if="supervisor.category" :category-id="supervisor.category"></category-label>
        </v-list-item-action>
      </v-list-item>
      <v-toolbar flat dense class="hidden-md-and-down">
        <v-toolbar-items>
          <v-btn small text @click="onRefresh(supervisor)">
            <v-icon left>mdi-refresh</v-icon>
            Refresh
          </v-btn>
          <v-btn small text @click="onEditSupervisor(supervisor)">
            <v-icon left>mdi-pencil</v-icon>
            Edit
          </v-btn>
          <v-btn v-if="supervisor.enable" small text @click="onToggleEnableListener(supervisor, false)">
            <v-icon left>mdi-power-plug-off-outline</v-icon>
            Pause
          </v-btn>
          <v-btn v-else small text @click="onToggleEnableListener(supervisor, true)">
            <v-icon left>mdi-power-plug-outline</v-icon>
            Enable
          </v-btn>
          <v-btn color="error" small text @click="onDeleteSupervisor(supervisor)">
            <v-icon left>mdi-delete-outline</v-icon>
            Delete
          </v-btn>

        </v-toolbar-items>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-spacer></v-spacer>
          <v-btn small text @click="onStopAll(supervisor)">
            <v-icon left>mdi-pause-circle-outline</v-icon>
            Stop all
          </v-btn>
          <v-btn small text @click="onStartAll(supervisor)">
            <v-icon left>mdi-play-circle-outline</v-icon>
            Start all
          </v-btn>
          <v-btn small text @click="onRestartAll(supervisor)">
            <v-icon left>mdi-restart</v-icon>
            Restart all
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

    </v-list>
    <slot name="config"></slot>

    <supervisor-form-dialog :open.sync="openSupervisorForm" :item="currentSupervisor"></supervisor-form-dialog>
    <v-dialog v-model="openConfirmSupervisorDelete" max-width="550px">
      <v-card>
        <v-card-title class="text-h5">Are you sure you want to delete {{ currentSupervisor.name }} ?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="openConfirmSupervisorDelete = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="onConfirmDeleteSupervisor">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import moment from "moment";
import categoryHelperMixin from "../categories/mixins/categoryHelperMixin";
import CategoryLabel from "../categories/CategoryLabel";
import SupervisorFormDialog from "./SupervisorFormDialog";
import supervisorHelperMixin from "./mixins/supervisorHelperMixin";

export default {
  name: "SupervisorDashcard",
  components: {CategoryLabel, SupervisorFormDialog},
  mixins: [categoryHelperMixin, supervisorHelperMixin],
  props: {
    supervisor: {
      type: Object,
      required: true
    },
    showToolBar: {
      type: Boolean,
      default: true
    },
    flat: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    openSupervisorForm: false,
    openConfirmSupervisorDelete: false,
    currentSupervisor: {name: ''},
    moment,
  }),
  mounted() {

  },
  methods: {}
}
</script>

<style scoped>

</style>
