class LobbyApplication extends PIXI.Application {
	constructor(...args) {
		super(...args);

		this.background = new PIXI.Container();
		this.background.name = 'LobbyBackground';
		this.stage.addChild(this.background);

		this.bg = new PIXI.Sprite(assetStorage.getTexture('LobbyWall'));
		this.stage.addChild(this.bg);

		this.bed = new PIXI.Sprite(assetStorage.getTexture('Bed'));
		this.bed.x = 1000;
		this.bed.y = 650;
		this.stage.addChild(this.bed);

		this.hud = new PIXI.Container();
		this.hud.name = 'hud';
		this.world = new PIXI.Container();
		this.world.name = 'world';

		this.stage.addChild(this.world);
		this.stage.addChild(this.hud);
	}

	displayOwnedItem(spriteName, position) {
		const slug = spriteName.toLowerCase();

		if (GameApp.vue.$store.state.player.ownedItems.indexOf(slug) === -1) {
			return;
		}

		this[slug] = new PIXI.Sprite(assetStorage.getTexture(spriteName));

		this[slug].x = position.x;
		this[slug].y = position.y;

		this.stage.addChild(this[slug]);
	}

	takeAwayItem(spriteName) {
		const slug = spriteName.toLowerCase();

		if (slug === 'will to live') {
			swal({
				text: 'How can something that I never had be taken away?'
			});
		}

		if (GameApp.vue.$store.state.player.ownedItems.indexOf(slug) === -1) {
			return;
		}

		GameApp.vue.$store.commit('removePlayerItem', slug);

		//init for future use
		const tape = new PIXI.Sprite(assetStorage.getTexture('Tape'));
		tape.anchor.set(0.5, 0.5);

		this[slug].addChild(tape);
		tape.position.set(this[slug].width / 2, this[slug].height / 2);
		tape.scale.set(this[slug].width / tape.width * 1.2);

		TweenMax.fromTo(tape, .3, {alpha: 0}, {alpha: 1});

		setTimeout(() => {
			TweenMax.to(this[slug], .3, {
				alpha: 0, onComplete: () => {
					this.stage.removeChild(this[slug]);

					this[slug].on('removed', () => {
						window.eventHub.$emit('lobby.itemRemoved');
					});
				}
			});
		}, 2000);
	}
}