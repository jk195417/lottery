// parcel entry point

// import css main file here
import './assets/stylesheets/main.scss'
// animate.css https://github.com/daneden/animate.css
import 'animate.css/animate.css'
// fontawesome-free https://fontawesome.com
import '@fortawesome/fontawesome-free/css/all.css'

// import js main file here
import './assets/javascripts/main.js'
// vue app
import Vue from 'vue/dist/vue.esm.js'
import App from './App.vue'
const app = new Vue({
  el: '#app',
  components: {
    'app': App
  }
})
