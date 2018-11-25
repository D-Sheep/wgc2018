<template>
	<div class="vue-app">
		<div class="shop">
			<div class="shop__food">
				<div class="shop__food-items">
					<shop-item v-for="item in food" :item="item" :player="player"/>
				</div>
			</div>
			<div class="shop__furniture">
				<div class="shop__furniture-items">
					<shop-item v-for="item in furniture" :item="item" :player="player"/>
				</div>
			</div>
		</div>
		<div class="overlay-spacer"></div>
	</div>
</template>

<style lang="scss" scoped>
	.vue-app {
		height: 100%;
		width: 100%;

		background-image: url('assets/img/shop.png');
		background-position: 50% 50%;
		background-repeat: no-repeat;
	}

	.shop {
		height: 100%;
		width: 820px;

		top: 40px;
		left: 810px;

		position: absolute;

		&__furniture,
		&__food {
			&-header {
				font-weight: bold;
				margin: 10px;
			}
		}
	}
</style>

<script>
	module.exports = {
		name: 'Shop',
		components: {
			'shop-item': require('../components/shop/ShopItem.vue')
		},
		computed: {
			route: {
				get() {
					return this.$store.state.route;
				},
				set($event) {
					this.$store.commit('navigateTo', $event);
				}
			},
			player() {
				return this.$store.state.player;
			},
			food() {
				return require('../../../../../../assets/items/shop/food.json');
			},
			furniture() {
				return require('../../../../../../assets/items/shop/furniture.json');
			}
		},
		mounted() {
		}
	}
</script>
