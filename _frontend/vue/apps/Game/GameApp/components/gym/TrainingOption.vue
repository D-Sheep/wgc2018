<template>
	<div
		class="training-option"
		:style="{backgroundImage: 'url(assets/img/gym/'+ trainingOption.name +'.png)'}"
		@click="train"
	>
	</div>
</template>

<style lang="scss" scoped>
	.training-option {
		margin: 25px;
		cursor: pointer;

		width: 421px;
		height: 147px;
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