const Vuex = require('vuex');

module.exports = new Vuex.Store({
	state: {
		player: {
			stats: {
				//general
				money: BASE_MONEY,
				injury: BASE_INJURY,
				hunger: BASE_HUNGER,
				strength: BASE_STRENGTH,
				//short-time energy
				energy: BASE_ENERGY,
			},
			states: {
				//non-breaking stat, only makes it slightly harder/easier
				happiness: BASE_HAPPINESS,
				lifes: BASE_LIFES
			}
		},
	},
	mutations: {
		updatePlayerStat(state, payload) {
			state.player.stats[payload.stat] = payload.value;
		},
		updatePlayerStats(state, payload) {
			state.player.stats = payload;
		}
	},
	actions: {}
});
