import Vue from 'vue'
import Vuex from 'vuex'
import task from './task.js'
import user from './user.js'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    task,
    user
  }
})
