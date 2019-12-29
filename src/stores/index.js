import Vue from 'vue/dist/vue.esm'
import Vuex from 'vuex/dist/vuex.esm'
import config from './modules/config'
import gifts from './modules/gifts'
import winners from './modules/winners'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    config,
    gifts,
    winners
  }
})
