const VueRouter = require('vue-router');

const router = new VueRouter({
	base: `/ordinary_martin/`,
	mode: 'history',
	routes: [
		{
			path: '/',
			component: require('./pages/Index.vue'),
		},
	],
});

module.exports = router;
