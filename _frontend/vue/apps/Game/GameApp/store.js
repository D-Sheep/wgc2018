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
		shopItems: [
			//food
			{type: 'food', name: 'Hamburger', stat: 10, price: 6, icon: 'assets/img/shop/hamburger.png'},
			{type: 'food', name: 'Pizza', stat: 20, price: 12, icon: 'assets/img/shop/pizza.png'},
			{type: 'food', name: 'Spaghetti', stat: 5, price: 3, icon: 'assets/img/shop/spaghetti.png'},
			{type: 'food', name: 'Meat balls', stat: 15, price: 9, icon: 'assets/img/shop/meat_balls.png'},
			{type: 'food', name: 'Chinese soup', stat: 1, price: 1, icon: 'assets/img/shop/chinese_soup.png'},
			//furniture
			{type: 'furniture', name: 'Table', stat: 1, price: 100, icon: 'assets/img/shop/table.png'},
			{type: 'furniture', name: 'Chair', stat: 1, price: 60, icon: 'assets/img/shop/chair.png'},
			{type: 'furniture', name: 'Bed', stat: 1, price: 200, icon: 'assets/img/shop/bed.png'},
			{type: 'furniture', name: 'Fridge', stat: 1, price: 400, icon: 'assets/img/shop/fridge.png'},
			{type: 'furniture', name: 'Fan', stat: 1, price: 40, icon: 'assets/img/shop/fan.png'},
			{type: 'furniture', name: 'Lamp', stat: 1, price: 10, icon: 'assets/img/shop/table.png'},
			{type: 'furniture', name: 'Plushie', stat: 1, price: 20, icon: 'assets/img/shop/plushie.png'},
			{type: 'furniture', name: 'Tv', stat: 1, price: 500, icon: 'assets/img/shop/tv.png'},
			{type: 'furniture', name: 'Bike', stat: 1, price: 400, icon: 'assets/img/shop/bike.png'},
			{type: 'furniture', name: 'Telescope', stat: 1, price: 2000, icon: 'assets/img/shop/telescope.png'}
		],
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
