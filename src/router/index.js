import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Auth from '../views/Authentication/Auth.vue'

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
