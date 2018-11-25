<template>
	<div class="training-options">
		<div class="training-options__content">
			<div class="training-options__wrapper">
				<training-option
					v-for="trainingOption in trainingOptions"
					:training-option="trainingOption"
					@isTraining="$emit('isTraining', $event)"
				/>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.training-options {
		display: flex;
		align-items: center;
		justify-content: center;

		&__header {
			margin: 10px;
			font-weight: bold;
		}
	}
</style>

<script>
	module.exports = {
		name: 'TrainingOptions',
		components: {
			'training-option': require('./TrainingOption.vue')
		},
		computed: {
			trainingOptions() {
				return require('../../../../../../../assets/items/gym/training-options.json');
			}
		}
	}
</script>
