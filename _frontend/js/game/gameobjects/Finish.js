class Finish extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.visible = false;
		this.width = 200;
		this.height = 300;
		this.bottomCenterAnchor();
	}
}