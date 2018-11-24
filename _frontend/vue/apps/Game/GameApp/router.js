const VueRouter = require('vue-router');

const router = new VueRouter({
	base: `/frigus/wgc2018/`,
	mode: 'history',
	routes: [
		{
			path: '/',
			redirect: {name: 'index'}
		},
		{
			name: 'index',
			path: '/index',
			component: require('./pages/Index.vue'),
		},
		{
			name: 'error',
			path: '*',
			component: require('./pages/Error.vue'),
		},
	],
});

module.exports = router;
