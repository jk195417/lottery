import Vue from 'vue/dist/vue.js'
import lottery from './lottery'

const vm = new Vue({
  el: '#app',
  components: {
    'lottery': lottery
  }
})
