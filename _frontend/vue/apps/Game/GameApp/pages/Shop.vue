<template>
	<div class="vue-app">
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
	}
</style>

<script>
	module.exports = {
		name: 'Shop',
		components: {
			'shop-item': require('../components/lobby/ShopItem.vue')
		},
		computed: {
			player() {
				return this.$store.state.player;
			},
			food() {
				return _.filter(this.$store.state.shopItems, {type: 'food'});
			},
			furniture() {
				return _.filter(this.$store.state.shopItems, {type: 'furniture'});
			}
		},
		mounted() {
		}
	}
</script>
