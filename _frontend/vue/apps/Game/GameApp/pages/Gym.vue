<template>
	<div class="vue-app">
		<a href="#" @click.prevent="route = 'lobby'"><- To lobby</a>
		<training-options
			v-if="hasEntered && !isTraining"
			@isTraining="setupTraining"
		/>
		<training
			v-if="hasEntered && isTraining"
			:training="training"
			:player="player"
			@trained="resetTraining"
		/>
	</div>
</template>

<style lang="scss" scoped>

</style>

<script>
	module.exports = {
		name: 'Gym',
		components: {
			'training-options': require('../components/gym/TrainingOptions.vue'),
			'training': require('../components/gym/Training.vue')
		},
		data() {
			return {
				hasEntered: false,
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
			hasEntered(value) {
				if (value) {
					this.takeMoney();
				} else {
					this.route = 'lobby';
				}
			},
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
				this.notifyAboutFee();

				return;
			}

			this.warn();
		},
		methods: {
			warn() {
				swal({
					html: `You are about to enter the gym, and this will cost you ${BASE_GYM_FEE} coins.<br> Are you sure you want to go to the gym?`,
					showCancelButton: true,
					focusConfirm: false,

				})
					.then((result) => {
						this.hasEntered = result.value;
					})
			},
			notifyAboutFee() {
				swal({
					html: `It costs ${BASE_GYM_FEE} coins to hit the gym.`
				});
			},
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