import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Auth from "../views/Authentication/Auth.vue";
import UnknownDevice from "../views/Errors/DeviceNotRecognized.vue";
import CreateProfile from "../views/Profile/CreateProfile.vue";
import UpdateProfile from "../views/Profile/UpdateProfile.vue";
import CreateInventory from "../views/Inventory/CreateInventory.vue";
import InventoryHome from "../views/Inventory/InventoryHome.vue";
import InventoryHelp from "../views/Inventory/InventoryHelp"
import ReviewHome from "../views/Review/ReviewHome.vue"
import NotificationHome from "../views/Notification/NotificationHome.vue"
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
    path: "/unknownDevice",
    name: "UnknownDevice",
    component: UnknownDevice,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    children:[
      {
        path: "/createProfile",
        name: "CreateProfile",
        component: CreateProfile,
      },
      {
        path: "/inventory",
        name: "InventoryHome",
        component: InventoryHome,
      },
      {
        path: "/updateProfile",
        name: "UpdateProfile",
        component: UpdateProfile,
      },
      {
        path: "/createInventory",
        name: "CreateInventory",
        component: CreateInventory,
    
      },
      {
        path: "/inventoryHelp",
        name: "InventoryHelp",
        component: InventoryHelp
      },
      {
        path:"/notification",
        name:"Notification",
        component:NotificationHome
      },
      {
        path:"/review",
        name:"Review",
        component:ReviewHome
      }
    ]
  },
  
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.afterEach((to, from) => {
  sessionStorage.setItem("lastUrl", `${from.name}`);
});

router.beforeEach((to, from, next) => {
  // incase of refresh
  var lastUrl = sessionStorage.getItem("lastUrl");
  if (lastUrl === to.name) {
    sessionStorage.removeItem("lastUrl");
    if(navigationType() == 1){
      console.log("page was reloaded")
      return next({ name: `${lastUrl}` });
    }
  }

  let deviceIsKnown, tokenIsValid, hasProfile;
  [tokenIsValid,deviceIsKnown,hasProfile ] = store.getters.getPrerequisites;
  // console.log(to.name,tokenIsValid,deviceIsKnown,hasProfile,"router")
  if (
    to.name !== "CreateProfile" &&
    deviceIsKnown===true &&
    tokenIsValid===true &&
    !hasProfile
  ) {
    return next({ name: "CreateProfile" });
  }
  if (to.name === "CreateProfile" && hasProfile===true) {
    return next({ name: "UpdateProfile" });
  }

  else if (to.name !== "UnknownDevice" && deviceIsKnown===false) {
    
    return next({ name: "UnknownDevice" });
  }
  else if(to.name === "Auth" && tokenIsValid==='true'){
    return next({ name: "InventoryHome",params:{ 'loadType':'discardSession' } });
  }
  else if (to.name !== "Auth" && to.name !== "UnknownDevice" && tokenIsValid===false) {
   
    next({ name: "Auth" });
  } 
  else if(from.name===to.name){
    next(false)
  }
  else {
    return next();
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
