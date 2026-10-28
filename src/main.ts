import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useLotteryStore } from './store'
import { persist } from './persistence'

const app = createApp(App).use(createPinia())
persist(useLotteryStore())
app.mount('#app')
