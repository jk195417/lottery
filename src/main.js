import './assets/javascripts/import_jquery.js' // import jquery and binding at window.$ and windows.jQuery
import 'bootstrap' // import before jQuery
import Vue from 'vue/dist/vue.esm.js'
import App from './App.vue'

// global references, for managing state
window.lottery = {
  gifts: [],
  winners: [],
  config: {
    min: 1,
    max: 100,
    msOfDrawing: 800, // 800ms
    msOfNoticing: 1000, // 1000ms
  }
}

// init vue app
const app = new Vue({
  el: '#app',
  components: {
    'app': App
  }
})
