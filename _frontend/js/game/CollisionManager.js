class CollisionManager {
	constructor() {
		this.callbacks = [];

		application.ticker.add(() => {
			const gameObjects = this.getCollidableObjects();

			this.callbacks.forEach((cb) => {
				const bounds = cb.object.getBounds();

				gameObjects
					.filter((gameObject) => gameObject instanceof cb.otherClass)
					.forEach((gameObject) => {
						const otherBounds = gameObject.getBounds();

						if (!bounds.intersects(otherBounds)) {
							return;
						}

						cb.handler(gameObject);
					});
			});
		});
	}

	on(object, otherClass, handler) {
		this.callbacks.push({object, otherClass, handler});
	}

	get(object, otherClass) {
		const bounds = object.getBounds();

		return this
			.getCollidableObjects()
			.filter((gameObject) => gameObject instanceof otherClass)
			.find((gameObject) => bounds.intersects(gameObject.getBounds()));
	}

	getCollidableObjects() {
		return application.getGameObjects().filter((gameObject) => gameObject.isCollisionEnabled);
	}

}