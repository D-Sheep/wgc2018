<template>
	<div class="training-option" @click="train">
		<div class="training-option__content">
			<div class="training-option__name">
				{{ trainingOption.name }}
			</div>
			<div class="training-option__reward">
				+{{ trainingOption.reward }} energy
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.training-option {
		margin: 10px;
		cursor: pointer;
		text-align: center;

		width: 130px;
		height: 130px;
		border: 2px dotted black;
		border-radius: 3px;

		display: inline-flex;
		align-items: center;
		justify-content: center;

		&--disabled {
			opacity: .5;
			cursor: not-allowed;
		}

		&__name {
			width: 100%;
			font-weight: bold;
		}
	}
</style>

<script>
	module.exports = {
		name: 'TrainingOption',
		props: ['trainingOption'],
		methods: {
			train() {
				this.$emit('isTraining', {
					state: true,
					option: this.trainingOption
				});
			}
		}
	}
</script>