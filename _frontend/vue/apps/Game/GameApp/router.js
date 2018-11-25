const VueRouter = require('vue-router');

const router = new VueRouter({
	base: `/frigus/wgc2018/`,
	mode: 'history',
	routes: [
		{
			path: '/',
			component: require('./pages/Index.vue'),
		},
	],
});

module.exports = router;
