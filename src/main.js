// require bootstrap
import $ from 'jquery/dist/jquery.js'
import Popper from 'popper.js/dist/esm/popper.js'
window.Popper = Popper
window.$ = $
require('bootstrap')

// vue
import Vue from 'vue/dist/vue.esm.js'
import App from './App.vue'
const app = new Vue({
  el: '#app',
  components: {
    'app': App
  }
})
// window.app = app
