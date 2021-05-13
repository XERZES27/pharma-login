import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Authentication/Auth.vue'
import UnknownDevice from '../views/Errors/DeviceNotRecognized.vue'
import store from '../store';

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Auth',
    component: Auth
    // which is lazy-loaded when the route is visited.
  },
  {
    path:'/home',
    name:'Home',
    component:Home
  },
  {
    path:'/unknownDevice',
    name:'UnknownDevice',
    component:UnknownDevice
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  
})

router.beforeEach((to,from,next)=>{
  let deviceIsKnown,tokenIsValid;
  [deviceIsKnown,tokenIsValid] =store.getters.getIsDeviceValidAndIsTokenValid;
  console.log(deviceIsKnown,tokenIsValid)
  
  if(to.name !== 'UnknownDevice' &&!deviceIsKnown){
    next({name:'UnknownDevice'})
  }
  if (to.name !== 'Auth'  && to.name!=='UnknownDevice' && !tokenIsValid) {
    next({ name: 'Auth' });
  } 
  
  
  
  else{next();}
    
    
  




})

export default router
