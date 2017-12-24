// bootstrap
import $ from 'jquery/dist/jquery.js'
import Popper from 'popper.js/dist/esm/popper.js'
window.Popper = Popper
window.$ = $
require('bootstrap')

// vue
import Vue from 'vue/dist/vue.esm.js'
import lottery from './lottery.js';
const app = new Vue(lottery)
window.app = app
