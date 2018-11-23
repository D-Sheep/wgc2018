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
			name: 'lobby',
			path: '/lobby',
			component: require('./pages/Lobby.vue'),
		},
		{
			name: 'stage',
			path: '/stage',
			component: require('./pages/Stage.vue'),
		},
		{
			name: 'error',
			path: '*',
			component: require('./pages/Error.vue'),
		},
	],
});

module.exports = router;
