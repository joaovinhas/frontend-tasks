import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import LoginView from '../views/users/LoginView.vue'
import RegisterView from '../views/users/RegisterView.vue'
import AllUserView from '../views/users/AllUserView.vue'
import DashboardView from '../views/users/DashboardView.vue'
import EditUserView from '../views/users/EditUserView.vue'

import TasksView from '../views/tasks/TasksView.vue'

const routes = [
  {
    path: '/',
    name: '/',
    component: HomeView
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView
  },
  {
    path: '/All_users',
    name: 'All_users',
    component: AllUserView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView
  },
  {
    path: '/edit_user',
    name: 'edit_user',
    component: EditUserView
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
