import Vue from 'vue'

const state = Vue.observable({
    notifiers: [],
    categories: [],
    supervisors: []
  });
  const methods = {
    onCategoriesChange(categories) {
      const index = state.categories.findIndex(x => x.id === categories.id)
      if (index !== -1) {
        state.categories.splice(index, 1, categories)
      } else {
        state.categories.push(categories)
      }
    },
    onCategoriesList(categories) {
      console.log('load', categories)
      state.categories = categories
    },
    onNotifiersChange(notifier) {
      const index = state.notifiers.findIndex(x => x.id === notifier.id)
      if (index !== -1) {
        state.notifiers.splice(index, 1, notifier)
      } else {
        state.notifiers.push(notifier)
      }
    },
    onNotifiersList(notifiers) {
      state.notifiers = notifiers
    },
    onSupervisorsChange(supervisor) {
      const index = state.supervisors.findIndex(x => x.id === supervisor.id)
      if (index !== -1) {
        state.supervisors.splice(index, 1, supervisor)
      } else {
        state.supervisors.push(supervisor)
      }
    },
    onSupervisorsList(supervisors) {
      state.supervisors = supervisors
    },
    // onStop(data) {
    //   const index = state.supervisors.findIndex(x => x.id === data.id)
    //   if (index !== -1) {
    //     const supervisor = state.supervisors[index]
    //     const processusIdx = supervisor.processus.findIndex(x => x.group === data.group && x.name === data.name)
    //     supervisor.processus[processusIdx].action = "stop"
    //     supervisor.processus[processusIdx].actionInProgress = true
    //     // process.action = "stop"
    //     // process.actionInProgress = true
    //     // Vue.set(state.supervisors[index].processus, processusIdx, process)
    //     state.supervisors.splice(index, 1, supervisor)
    //     // state.supervisors = [...state.supervisors]
    //   }
    // },
    // onStart(data) {
    //   const index = state.supervisors.findIndex(x => x.id === data.id)
    //   if (index !== -1) {
    //     const processusIdx = state.supervisors[index].processus.findIndex(x => x.group === data.group && x.name === data.name)
    //     const process = state.supervisors[index].processus[processusIdx]
    //     process.action = "start"
    //     process.actionInProgress = true
    //     Vue.set(state.supervisors[index].processus, processusIdx, process)
    //   }
    // },
    // onRestart(data) {
    //   const index = state.supervisors.findIndex(x => x.id === data.id)
    //   if (index !== -1) {
    //     const processusIdx = state.supervisors[index].processus.findIndex(x => x.group === data.group && x.name === data.name)
    //     const process = state.supervisors[index].processus[processusIdx]
    //     process.action = "restart"
    //     process.actionInProgress = true
    //     Vue.set(state.supervisors[index].processus, processusIdx, process)
    //   }
    // },
    // onStartAll(id) {
    //   console.log(id)
    //   const index = state.supervisors.findIndex(x => x.id === id)
    //   if (index !== -1) {
    //     const processus = []
    //     state.supervisors[index].processus.forEach(process => {
    //       if (process.statename !== 'RUNNING') {
    //         process.action = "start"
    //         process.actionInProgress = true
    //       }
    //       processus.push(process)
    //     })
    //     Vue.set(state.supervisors[index], 'processus', processus)
    //     // state.supervisors = [...state.supervisors]
    //   }
    // },
    // onStopAll(id) {
    //   console.log(id)
    //   const index = state.supervisors.findIndex(x => x.id === id)
    //   if (index !== -1) {
    //     const processus = []
    //     state.supervisors[index].processus.forEach(process => {
    //       if (process.statename === 'RUNNING') {
    //         process.action = "stop"
    //         process.actionInProgress = true
    //       }
    //       processus.push(process)
    //     })
    //     Vue.set(state.supervisors[index], 'processus', processus)
    //   }
    // },
    // onRestartAll(id) {
    //   console.log('ERSTART',id)
    //   const index = state.supervisors.findIndex(x => x.id === id)
    //   if (index !== -1) {
    //     const processus = []
    //     state.supervisors[index].processus.forEach(process => {
    //       process.action = "restart"
    //       process.actionInProgress = true
    //       processus.push(process)
    //     })
    //     // state.supervisors[index].splice(index, 1, 'process', processus)
    //     Vue.set(state.supervisors[index], 'process', processus)
    //   }
    // },
  }

export { state, methods }
