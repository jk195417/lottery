import Vue from 'vue/dist/vue.esm.js'
import Vuex from 'vuex'
import mutations from './_mutations.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,

  state () {
    return {
      Gifts: [
      ],
      Config: {}
    }
  },

  plugins: [],
  mutations,

  modules: {}
})
