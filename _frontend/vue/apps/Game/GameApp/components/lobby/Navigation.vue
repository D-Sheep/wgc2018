<template>
	<div class="navigation">
		<ul>
			<li @click.prevent="navigate(item)" v-for="(label, item) in navigationItems">{{ label }}</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
	.navigation {
		padding: 0;
		margin: 0;

		width: 100%;

		display: flex;
		justify-content: center;
		align-items: center;

		ul {
			list-style-type: none;
			padding: 0;
			margin: 0;

			li {
				cursor: pointer;
				width: 250px;
				height: 50px;
				border: 2px solid burlywood;
				text-align: center;
				text-transform: uppercase;
				line-height: 50px;
				font-size: 30px;
				border-radius: 3px;
				margin: 10px;

				&:hover {
					background: darken(white, 10%);
				}
			}
		}
	}
</style>

<script>
	module.exports = {
		name: 'Navigation',
		props: ['navigationItems'],
		data() {
			return {
				enterGym: false,
			}
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
			canVisitGym() {
				return this.player.states.money >= BASE_GYM_FEE;
			}
		},
		methods: {
			navigate(route) {
				if (route === 'gym') {
					if (this.canVisitGym) {
						this.warnAboutFee();
					} else {
						this.notifyAboutFee();
					}

					return;
				}

				this.route = route;
			},
			warnAboutFee() {
				swal({
					html: `Entering the GYM will cost you ${BASE_GYM_FEE} coins.`,
					showCancelButton: true,
					focusConfirm: false,

				})
					.then((result) => {
						if (result.value) {
							this.route = 'gym';
						}
					})
			},
			notifyAboutFee() {
				swal({
					html: `It costs ${BASE_GYM_FEE} coins to hit the gym.`
				});
			},
		}
	}
</script>