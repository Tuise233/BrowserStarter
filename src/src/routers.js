import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './views/Home';
import HomePage from './views/HomePage';
import HomePagePE from './views/HomePagePE';

Vue.use(VueRouter);

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/pc',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '/pe',
      name: 'HomePagePE',
      component: HomePagePE
    },
  ]
  
const router = new VueRouter({
    routes
});

export default router;