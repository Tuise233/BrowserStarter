import Vue from 'vue';
import VueRouter from 'vue-router';

import PcHome from '@/views/PcHome.vue';
import PeHome from '@/views/PeHome.vue';

Vue.use(VueRouter);

const routes = [
	{
		path: "/pc",
		name: "PcHome",
		component: PcHome
	},
	{
		path: "/pe",
		name: "PeHome",
		component: PeHome
	}
]
  
const router = new VueRouter({
    routes,
    mode: "history"
});

export default router;