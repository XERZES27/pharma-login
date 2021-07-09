import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"
createApp(App).use(store).use(ElementPlus).use(router).mount('#app')
