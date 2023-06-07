import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue'
import PathNotFound from '../views/auth/PageNotFound.vue'
import ProfileView from '../views/auth/ProfileView.vue'

import TransactionView from '../views/transaction/IndexView.vue'
import ProductView from '../views/product/IndexView.vue'
import ProductForm from '../views/product/FormView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/',
    name: 'home',
    component: HomeView,
    // meta: {
    //   requiresAuth: true,
    // }
  },
  {
    path: '/transaction',
    name: 'transaction',
    component: TransactionView,
    // meta: {
    //   requiresAuth: true,
    // }
  },
  {
    path: '/master/product',
    name: 'product',
    component: ProductView,
  },
  {
    path: '/master/product/create',
    name: 'produt-create',
    component: ProductForm,
  },
  {
    path: '/master/product/:slug/edit',
    name: 'produt-edit',
    component: ProductForm,
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView
  },
  { 
    path: '/:pathMatch(.*)*', 
    component: PathNotFound 
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn) {
  // if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
