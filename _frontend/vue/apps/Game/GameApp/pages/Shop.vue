<template>
	<div class="vue-app">
		<a href="#" @click.prevent="route = 'lobby'"><- To lobby</a>
		<div class="shop">
			<div class="shop__food">
				<div class="shop__food-header">
					Food
				</div>
				<div class="shop__food-items">
					<shop-item v-for="item in food" :item="item" :player="player"/>
				</div>
			</div>
			<div class="shop__furniture">
				<div class="shop__furniture-header">
					Furniture
				</div>
				<div class="shop__furniture-items">
					<shop-item v-for="item in furniture" :item="item" :player="player"/>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.shop {
		height: 100vh;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

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
