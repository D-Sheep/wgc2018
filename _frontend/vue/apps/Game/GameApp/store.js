const Vuex = require('vuex');

module.exports = new Vuex.Store({
	state: {
		player: {
			stats: {
				//general
				injury: BASE_INJURY,
				hunger: BASE_HUNGER,
				strength: BASE_STRENGTH,
				//short-time energy
				energy: BASE_ENERGY,
			},
			states: {
				//non-breaking stat, only makes it slightly harder/easier
				happiness: BASE_HAPPINESS,
				//general
				money: BASE_MONEY
			},
			ownedItems: [
				'table',
				'chair',
				'bed',
				'fridge',
				'fan',
				'lamp'
			]
		},
		route: 'index'
	},
	mutations: {
		updatePlayerStat(state, payload) {
			state.player.stats[payload.stat] = payload.value;
		},
		updatePlayerStats(state, payload) {
			state.player.stats = payload;
		},
		updatePlayerState(state, payload) {
			state.player.states[payload.state] = payload.value;
		},
		addPlayerItem(state, payload) {
			state.player.ownedItems.push(payload);
		},
		removePlayerItem(state, payload) {
			state.player.ownedItems.splice(_.findIndex(state.player.ownedItems, payload), 1);
		},
		navigateTo(state, payload) {
			state.route = payload;
		}
	},
	actions: {}
});
