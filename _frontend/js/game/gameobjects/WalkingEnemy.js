class WalkingEnemy extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.direction = Helpers.choose([1, -1]);
		this.speed = 40;
		this.limitLeft = data.limit[0];
		this.limitRight = data.limit[1];

		application.ticker.add(() => {
			if (this.x < this.limitLeft) {
				this.direction = 1;
			}

			if (this.x > this.limitRight) {
				this.direction = -1;
			}

			this.x += this.direction * application.ticker.deltaTime / application.ticker.FPS * this.speed;
		});
	}
}