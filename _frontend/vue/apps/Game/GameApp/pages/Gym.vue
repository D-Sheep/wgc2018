<template>
	<div class="vue-app">
		<training-options
			v-if="!isTraining"
			@isTraining="setupTraining"
		/>
		<training
			v-if="isTraining"
			:training="training"
			:player="player"
			@trained="resetTraining"
		/>
		<div class="home" @click="route = 'lobby'"></div>
	</div>
</template>

<style lang="scss" scoped>
	.vue-app {
		height: 100%;

		background-image: url('assets/img/gym/bg.jpg');
		background-position: 50% 50%;
		background-repeat: no-repeat;

		.home {
			position: absolute;
			top: 0;

			background-image: url('assets/img/home.png');

			margin: 25px;
			cursor: pointer;

			width: 421px;
			height: 147px;
		}
	}
</style>

<script>
	module.exports = {
		name: 'Gym',
		components: {
			'training-options': require('../components/gym/TrainingOptions.vue'),
			training: require('../components/gym/Training.vue')
		},
		data() {
			return {
				isTraining: false,
				training: {},
				trained: 0,
			};
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
			canVisit() {
				return this.player.states.money >= BASE_GYM_FEE;
			}
		},
		watch: {
			trained(value) {
				if (value >= MAX_TRAININGS) {
					this.route = 'lobby';
					this.notifyAboutMaxTrainings();
				}
			}
		},
		mounted() {
			if (!this.canVisit) {
				this.route = 'lobby';
			}

			this.takeMoney();
		},
		methods: {
			notifyAboutMaxTrainings() {
				swal({
					html: `For ${BASE_GYM_FEE} coins you can only train ${MAX_TRAININGS} times!`
				})
			},
			takeMoney() {
				this.$store.commit('updatePlayerState', {
					state: 'money',
					value: this.player.states.money - BASE_GYM_FEE < 1 ? 0 : this.player.states.money - BASE_GYM_FEE
				});
			},
			setupTraining($event) {
				this.isTraining = $event.state;
				this.training = $event.option;
			},
			resetTraining() {
				this.trained++;
				this.isTraining = false;
				this.training = {};
			}
		}
	}
</script>