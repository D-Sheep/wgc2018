const Vuex = require('vuex');
const VueRouter = require('vue-router');

module.exports = {
	vueEl: '#Game',

	init() {
		if ($(this.vueEl).length < 1) {
			return false;
		}

		Vue.use(Vuex);
		Vue.use(VueRouter);

		this.vue = new Vue({
			name: 'GameApp',
			el: this.vueEl,
			router: require('./router.js'),
			store: require('./store.js'),
			render: (createElement) => createElement(require('./pages/App.vue'))
		});
	}
};
