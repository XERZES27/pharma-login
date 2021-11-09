import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
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
  .use(router)
  .use(VueClickAway)
  .mount("#app");




