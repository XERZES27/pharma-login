import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/lib/theme-chalk/index.css";
// import 'bootstrap';
import VueClickAway from "vue3-click-away";

createApp(App)
  .directive("scroll", {
    beforeMount(el, binding, vnode) {
      let f = function(evt) {
        if (binding.value(evt, el)) {
          window.removeEventListener("scroll", f);
        }
      };
      window.addEventListener("scroll", f);
    },
  })
  .use(store)
  .use(ElementPlus)
  .use(router)
  .use(VueClickAway)
  .mount("#app");
