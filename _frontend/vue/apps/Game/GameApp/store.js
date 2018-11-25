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
				/*'chair',
				'fridge',
				'fan',
				'lamp',
				'plushie'*/
			]
		},
		reposession: false,
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
			const itemIndex = _.findIndex(state.player.ownedItems, (value) => {
				return value === payload;
			});

			state.player.ownedItems.splice(itemIndex, 1);
		},
		navigateTo(state, payload) {
			state.route = payload;
		},
		setAssetPromise(state, promise) {
			state.assetPromise = promise;
		},
		pendingReposession(state, reposession) {
			state.reposession = reposession;
		}
	},
	actions: {
		fetchAssets(context) {
			if (!context.state.assetPromise) {
				const promise = Promise.all([
					assetStorage.loadTextures(),
					assetStorage.loadSounds(),
					mapSectionStorage.loadMapSections()
				]);
				context.commit('setAssetPromise', promise);
			}

			return context.state.assetPromise;
		}
	}
});
