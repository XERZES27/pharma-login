import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Auth from "../views/Authentication/Auth.vue";
import UnknownDevice from "../views/Errors/DeviceNotRecognized.vue";
import CreateProfile from "../views/Profile/CreateProfile.vue";
import UpdateProfile from "../views/Profile/UpdateProfile.vue";
import store from "../store";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Auth",
    component: Auth,
    // which is lazy-loaded when the route is visited.
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/unknownDevice",
    name: "UnknownDevice",
    component: UnknownDevice,
  },
  {
    path: "/createProfile",
    name: "CreateProfile",
    component: CreateProfile,
  },
  {
    path: "/updateProfile",
    name: "UpdateProfile",
    component: UpdateProfile,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.afterEach((to, from) => {
  sessionStorage.setItem("lastUrl", `${to.name}`);
});

router.beforeEach((to, from, next) => {
  // incase of refresh
  var lastUrl = sessionStorage.getItem("lastUrl");
  if (lastUrl === null || lastUrl != to.name) {
    sessionStorage.removeItem("lastUrl");
    if(navigationType() == 1){
      console.log("page was reloaded")
      router.replace({ name: `${lastUrl}` });
    }
  }

  let deviceIsKnown, tokenIsValid, hasProfile;
  [tokenIsValid,deviceIsKnown,hasProfile ] = store.getters.getPrerequisites;
  console.log(tokenIsValid,deviceIsKnown,hasProfile,"router")
  if (
    to.name !== "CreateProfile" &&
    deviceIsKnown===true &&
    tokenIsValid===true &&
    !hasProfile
  ) {
    next({ name: "CreateProfile" });
  }
  if (to.name === "CreateProfile" && hasProfile===true) {
    next({ name: "UpdateProfile" });
  }

  if (to.name !== "UnknownDevice" && deviceIsKnown===false) {
    
    next({ name: "UnknownDevice" });
  }
  if(to.name === "Auth" && tokenIsValid===true){
    console.log(from.name)
    //TODO
    // navigate to home
    // next({name:from.name})
  }
  if (to.name !== "Auth" && to.name !== "UnknownDevice" && tokenIsValid===false) {
   
    next({ name: "Auth" });
  } else {
    next();
  }
});

function navigationType(){

  var result;
  var p;

  if (window.performance.navigation) {
      result=window.performance.navigation;
      if (result==255){result=4} // 4 is my invention!
  }

  if (window.performance.getEntriesByType("navigation")){
     p=window.performance.getEntriesByType("navigation")[0].type;

     if (p=='navigate'){result=0}
     if (p=='reload'){result=1}
     if (p=='back_forward'){result=2}
     if (p=='prerender'){result=3} //3 is my invention!
  }
  return result;
}

export default router;
