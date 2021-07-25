import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import 'bootstrap';
import "bootstrap/dist/css/bootstrap.min.css"
import VueClickAway from "vue3-click-away";
createApp(App).use(store).use(ElementPlus).use(router).use(VueClickAway).mount('#app')
