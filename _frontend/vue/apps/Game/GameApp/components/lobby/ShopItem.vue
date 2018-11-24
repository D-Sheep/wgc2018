<template>
	<div class="shop-item" :class="{'shop-item--disabled': !canBuy || isFull || isOwned}" @click="purchase">
		<div class="shop-item__icon">
			<img :src="item.icon" :title="item.name"/>
		</div>
		<div class="shop-item__name">
			{{ item.name }}
		</div>
		<div class="shop-item__price">
			Price: {{ item.price }}
		</div>
		<div class="shop-item__hunger">
			Refills: {{ item.stat }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.shop-item {
		display: inline-block;

		margin: 10px;
		cursor: pointer;
		text-align: center;

		&--disabled {
			opacity: .5;
			cursor: not-allowed;
		}

		&__icon {
			width: 130px;
			height: 130px;
			border: 2px dotted black;
			border-radius: 3px;
		}

		&__name {
			font-weight: bold;
		}
	}
</style>

<script>
	module.exports = {
		name: 'ShopItem',
		props: ['item', 'player'],
		computed: {
			canBuy() {
				return this.player.states.money >= this.item.price;
			},
			isFull() {
				return this.item.type === 'food' && this.player.stats.hunger < 1;
			},
			isOwned() {
				return this.item.type === 'furniture' && this.player.ownedItems.indexOf(this.item.name.toLowerCase()) !== -1;
			}
		},
		methods: {
			purchase() {
				if (!this.canBuy || this.isFull) {
					return;
				}

				this.takeMoney();
				this.givePlayer();
			},
			takeMoney() {
				this.$store.commit('updatePlayerState', {
					state: 'money',
					value: this.player.states.money - this.item.price < 1 ? 0 : this.player.states.money - this.item.price
				});
			},
			givePlayer() {
				switch (this.item.type) {
					case 'food':
						this.$store.commit('updatePlayerStat', {
							stat: 'hunger',
							value: this.player.stats.hunger - this.item.stat < 1 ? 0 : this.player.stats.hunger - this.item.stat
						});
						break;
					case 'furniture':
						this.$store.commit('addPlayerItem', this.item.name.toLowerCase());
						break;
				}
			}
		}
	}
</script>