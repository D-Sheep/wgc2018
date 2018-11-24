class Finish extends GameObject {
	constructor(textures, data) {
		super(textures, data);

		this.width = 200;
		this.height = 300;
		this.bottomCenterAnchor();
	}
}