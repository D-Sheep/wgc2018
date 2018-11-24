<template>
	<div class="training">
		<div class="training__progress" :style="{backgroundPositionX: -trained + '%'}">
			keep pressing the 'UP' arrow
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.training {
		&__progress {
			background: linear-gradient(to left, greenyellow 50%, white 50%);
			background-size: 200% 100%;
			background-position: left bottom;

			position: absolute;
			bottom: 20px;
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;

			padding: 5px;

			width: 220px;
			height: 50px;

			display: flex;
			align-items: center;
			justify-content: center;

			text-align: center;

			border: 2px solid black;
			border-radius: 3px;

			transition: ease background .1s;
		}
	}
</style>


<script>
	module.exports = {
		name: 'Training',
		props: ['training', 'player'],
		data() {
			return {
				trained: 0,
				difficulityInterval: null,
				keyPressed: false,
			};
		},
		computed: {
			finishedTraining() {
				return this.trained >= MAX_TRAINED;
			}
		},
		watch: {
			finishedTraining(value) {
				if (value) {
					const newEnergyValue = this.player.stats.energy + this.training.reward > MAX_ENERGY ? MAX_ENERGY : this.player.stats.energy + this.training.reward;

					this.$store.commit('updatePlayerStat', {stat: 'energy', value: newEnergyValue});
					this.trained = 0;
					this.$emit('trained');
				}
			}
		},
		beforeDestroy() {
			clearInterval(this.difficulityInterval);
			$('body').off('keydown');
			$('body').off('keyup');
		},
		mounted() {
			this.initControls();
			this.setDifficulityInterval();
		},
		methods: {
			initControls() {
				$('body').on('keydown', (event) => {
					if (event.keyCode === KEY_UP) {
						this.pressed();
					}
				});

				$('body').on('keyup', (event) => {
					if (event.keyCode === KEY_UP) {
						this.keyPressed = false;
					}
				})
			},
			setDifficulityInterval() {
				this.difficulityInterval = setInterval(() => {
					if (this.finishedTraining) {
						clearInterval(this.difficulityInterval);
					}

					if (this.trained <= 0) {
						this.trained = 0;

						return;
					}

					this.trained -= 2;
				}, 100)
			},
			pressed() {
				if (!this.keyPressed) {
					this.keyPressed = true;

					this.trained += Math.floor(10 - (this.training.reward / 12));
				}
			}
		}
	}
</script>