<template>
	<div class="training">
		<div class="training__progress" :style="{backgroundPositionX: -trained + '%'}">
			keep pressing<br> the "<strong>UP</strong>" arrow
		</div>
		<div class="training__hand"></div>
		<div class="training__arrow"></div>
	</div>
</template>

<style lang="scss" scoped>
	.training {
		&__progress {
			position: absolute;

			background: linear-gradient(to left, white 50%, transparent 50%);
			background-size: 200% 100%;
			background-position: left bottom;

			left: 0;
			right: 0;
			top: 145px;
			margin-left: auto;
			margin-right: auto;

			padding: 30px;

			width: 590px;

			vertical-align: middle;
			line-height: 1.5em;

			font-size: 30px;

			text-align: center;

			color: #65869e;

			border: 4px solid #65869e;
			border-radius: 80px;

			text-transform: uppercase;

			transition: ease background .1s;
		}

		&__hand {
			position: absolute;
			z-index: 2;

			bottom: 250px;
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;

			width: 280px;
			height: 326px;

			background-image: url('assets/img/gym/hand.gif');
			background-position: 50% 50%;
			background-repeat: no-repeat;
		}

		&__arrow {
			position: absolute;
			z-index: 1;

			bottom: 100px;
			left: 0;
			right: 0;
			margin-left: auto;
			margin-right: auto;

			width: 502px;
			height: 640px;

			background-image: url('assets/img/gym/arrow.png');
			background-position: 50% 50%;
			background-repeat: no-repeat;
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
					const newStrengthValue = this.player.stats.strength + this.training.reward > MAX_STRENGTH ?
						MAX_STRENGTH :
						this.player.stats.strength + this.training.reward;

					this.$store.commit('updatePlayerStat', {stat: 'strength', value: newStrengthValue});
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