<template>
	<div class="navigation">
		<ul>
			<li @click.prevent="navigate(item)" v-for="(label, item) in navigationItems">{{ label }}</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
	.navigation {
		position: absolute;
		z-index: 10;
		padding: 0;
		margin: 0;

		width: 100%;

		display: inline-flex;
		justify-content: flex-start;
		align-items: center;

		ul {
			list-style-type: none;
			padding: 0;
			margin: 0;

			li {
				display: inline-block;
				cursor: pointer;
				width: 70px;
				height: 30px;
				border: 2px solid burlywood;
				text-align: center;
				text-transform: uppercase;
				line-height: 30px;
				font-size: 14px;
				border-radius: 3px;
				margin: 10px 0;
				margin-right: 10px;
				background: white;

				&:hover {
					background: darken(white, 10%);
				}

				&:first-child {
					margin-left: 10px;
				}

				&:last-child {
					margin-right: 0;
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