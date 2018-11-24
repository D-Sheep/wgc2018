const Vuex = require('vuex');

module.exports = new Vuex.Store({
	state: {
		player: {
			stats: {
				//general
				money: 0,
				injury: 0,
				hunger: 0,
				strength: 0,
				//short-time energy
				energy: 0,
				//non-breaking stat, only makes it slightly harder/easier
				happiness: 0,
			}
		},
	},
	mutations: {
		updatePlayerStats(state, payload) {
			state.player.stats = payload;
		}
	},
	actions: {}
});
