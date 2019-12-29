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
import Vue from 'vue/dist/vue.esm'
import app from './app'
import store from './stores'

// eslint-disable-next-line no-unused-vars
const vueInstance = new Vue({
  store,
  el: '#vue-instance',
  components: {
    app
  }
})
