class CollisionManager {
    constructor() {
        this.callbacks = [];
        application.ticker.add(() => {
            const gameObjects = application.getGameObjects().filter((gameObject) => gameObject.isCollisionEnabled);
            this.callbacks.forEach((cb) => {
                const bounds = cb.object.getBounds(false);
                gameObjects.forEach((gameObject) => {
                    if (!gameObject instanceof cb.otherClass) {
                        return;
                    }

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

}