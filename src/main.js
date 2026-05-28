import { createApp } from 'vue'
import router from './router/index.js'
import App from './App.vue'
import './assets/main.css'

// Set dark mode as default
document.documentElement.setAttribute('data-theme', 'dark')

createApp(App).use(router).mount('#app')
