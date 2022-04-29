import Vue from 'vue';
import VueRouter from 'vue-router';

import HomePage from './components/HomePage';
import HomePagePE from './components/HomePagePE';

Vue.use(VueRouter);

const routes = [
    {
      path: '/',
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
    mode: 'history',
    routes
});

export default router;