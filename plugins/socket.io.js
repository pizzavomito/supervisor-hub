import Vue from 'vue'
import io from 'socket.io-client'
const socket = io()
Vue.use(socket)

export default ({ app }, inject) => {
  app.$socket = socket
  inject('socket', socket)
}
