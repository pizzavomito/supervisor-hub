const {Worker} = require('worker_threads')
const path = require('path')
const Events = require("./events");
const {SupervisorService, Cache, WebSocket, NotifierService} = require("./")

module.exports = class Jobs {

  workers = {}
  supervisorIds = []

  constructor({events}) {
    this.events = events
    // this.events.on(Events.ON_ADD_NOTIFIER,() => {
    //   this.restart()
    // })
    // this.events.on(Events.ON_DELETE_NOTIFIER,() => {
    //   this.restart()
    // })
    this.events.on(Events.ON_ADD_SUPERVISOR,() => {
      this.start()
    })
    this.events.on(Events.ON_DELETE_SUPERVISOR,() => {
      this.restart()
    })
    this.events.on(Events.ON_START_ALL_PROCESSES_SUPERVISOR,(supervisor) => {
      this.execute(supervisor.id)
    })
    this.events.on(Events.ON_STOP_ALL_PROCESSES_SUPERVISOR,(supervisor) => {
      this.execute(supervisor.id)
    })
    this.events.on(Events.ON_STOP_PROCESS_SUPERVISOR,(supervisor) => {
      this.execute(supervisor.id)
    })
    this.events.on(Events.ON_START_PROCESS_SUPERVISOR,(supervisor) => {
      this.execute(supervisor.id)
    })
    this.events.on(Events.ON_RESTART_PROCESS_SUPERVISOR,(supervisor) => {
      this.execute(supervisor.id)
    })
    this.events.on(Events.ON_REFRESH_SUPERVISOR,(supervisor) => {
      this.execute(supervisor.id)
    })

  }

  runWorker(file, workerData) {
    // return new Promise((resolve, reject) => {
      const worker = new Worker(file, { workerData })

      worker.on('online', () => {
        this.workers[workerData.id] = (this.workers[workerData.id] || [])
        this.workers[workerData.id].push({id: path.basename(file), instance: worker})

        // this.workers.push(worker)
        // console.log('DEBUT : Execution de la tâche intensive en parallèle')
      })

      // worker.on('message', workerMessage => {
      //   console.log(workerMessage)
      //   return resolve
      // })

      // worker.on('error', reject)
      worker.on('exit', code => {
        if (code !== 0) {
          // reject(new Error(`Worker stopped with exit code ${code}`))
          // eslint-disable-next-line no-new
          new Error(`Worker stopped with exit code ${code}`)
        }
      })
    // })
   //  const worker = new Worker(path, { workerData });
   //  //worker.on('message', cb.bind(null, null));
   // worker.on('error', (err) => {
   //   console.log('worker error', err)
   // });
   //  worker.on('exit', (exitCode) => {
   //    if (exitCode === 0) {
   //      return null;
   //    }
   //    console.log('worker exit')
   //   //  return cb(new Error(`Worker has stopped with code ${exitCode}`));
   //  });
   return worker;
  }

  stop() {
    for (const id in this.workers) {
      this.workers[id].forEach(worker => {
        worker.instance.postMessage('stop')
      })
    }
    this.supervisorIds = []
  }

  restart() {
    this.stop()
    this.start()
  }

  execute(supervisorId) {
    this.workers[supervisorId].forEach(worker => {
      worker.instance.postMessage('execute')
    })
  }

  getCountAlarm(supervisor) {
    let count = 0
    if (supervisor.error && supervisor.alarmConnectionFailed) {
      count++
    }
    if (!supervisor.process) {
      return 0
    }
    const errors = supervisor.process.filter(x => ['FATAL', 'UNKNOWN', 'BACKOFF'].includes(x.statename))
    if (errors.length > 0 ) {
      if (supervisor.alarmProcessError) {
        count++
      }
    }

    return count
  }

  getCountProcessByStatename(process, states) {
    if (process) {
      return process.filter(x => states.includes(x.statename)).length
    }
    return 0
  }

  getProcessByStatename(process) {
    const count = {}
    if (process) {
      process.forEach(proc => {
        count[proc.statename] = (count[proc.statename] || 0) + 1
      })
    }
    return count
  }

  start() {
    const supervisors = SupervisorService.findAll()
    const notifiers = NotifierService.findAll()

    for (const supervisor of supervisors) {

      if (this.supervisorIds.includes(supervisor.id)) {
        continue
      }

      const getAllProcessInfoWorker = this.runWorker('./server/workers/getAllProcessInfo.js',
        {id: supervisor.id,  notifiers, cache: Cache.map, interval: 10000})

      getAllProcessInfoWorker.on('message', message => {

        supervisor.error = null
        if (message.error) {
          supervisor.error = message.error.message
        }

        supervisor.process = message.process
        supervisor.state = message.state

        supervisor.at = new Date()
        supervisor.countAlarm = this.getCountAlarm(supervisor)
        supervisor.countRunning = this.getCountProcessByStatename(supervisor.process, ['RUNNING', 'STARTING'])
        supervisor.countStopped = this.getCountProcessByStatename(supervisor.process, ['STOPPED','STOPPING','EXITED'])
        supervisor.countError = this.getCountProcessByStatename(supervisor.process, ['FATAL','UNKNOWN','BACKOFF'])
        supervisor.processByStatename = this.getProcessByStatename(supervisor.process)
        supervisor.countProcess = supervisor.process?supervisor.process.length:0

        Cache.map.set('supervisor.'+supervisor.id, supervisor)
        Cache.map.set('supervisor.'+supervisor.id+'.process', supervisor.process)

        WebSocket.io.to(supervisor.id).emit('supervisor.change', supervisor)
        // io.to(supervisor.id).emit('supervisors.change', supervisor)
        delete supervisor.process
        WebSocket.io.emit('supervisors.change',supervisor)
      })

      // const getStateWorker = this.runWorker('./server/workers/getState.js', {id: supervisor.id, store: Store.map, interval: 10000})
      // getStateWorker.on('message', message => {
      //   supervisor.state = message.state
      //   supervisor.error = null
      //   if (message.error) {
      //     supervisor.state = null
      //     supervisor.error = message.error.message
      //   }
      //   Store.map.set(supervisor.id, supervisor)
      //   // io.emit('supervisors.change',supervisor)
      // })

      this.supervisorIds.push(supervisor.id)

      Cache.on('update', () => {
        for (const id in this.workers) {
          this.workers[id].forEach(worker => {
            worker.instance.postMessage({cache: Cache.map})
          })
        }
      })
    }
  }
}


