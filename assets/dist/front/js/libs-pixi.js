Object.assign(PIXI.Rectangle.prototype, {
	intersects: function(other) {
		return this.x < other.x + other.width &&
			this.y < other.y + other.height &&
			this.x + this.width > other.x &&
			this.y + this.height > other.y;
	}
});
;;Object.assign(PIXI.Point.prototype, {
	distance: function(other) {
		const x = this.x - other.x;
		const y = this.y - other.y;
		return Math.sqrt(x * x + y * y);
	}
});

Object.assign(PIXI.ObservablePoint.prototype, {
	distance: function(other) {
		const x = this.x - other.x;
		const y = this.y - other.y;
		return Math.sqrt(x * x + y * y);
	}
});
;;Object.assign(PIXI.Point.prototype, {
	add(other) {
		return new PIXI.Point(this.x + other.x, this.y + other.y);
	}
});

Object.assign(PIXI.ObservablePoint.prototype, {
	add(other) {
		return new PIXI.ObservablePoint(this.x + other.x, this.y + other.y);
	}
});
;;/*!
 * @pixi/filter-rgb-split - v2.5.0
 * Compiled Wed, 10 Jan 2018 17:38:59 UTC
 *
 * @pixi/filter-rgb-split is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,r){"object"==typeof exports&&"undefined"!=typeof module?r(exports,require("pixi.js")):"function"==typeof define&&define.amd?define(["exports","pixi.js"],r):r(e.__filters={},e.PIXI)}(this,function(e,r){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",n="precision mediump float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nvoid main(void)\n{\n   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/filterArea.xy).r;\n   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/filterArea.xy).g;\n   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/filterArea.xy).b;\n   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;\n}\n",o=function(e){function r(r,o,i){void 0===r&&(r=[-10,0]),void 0===o&&(o=[0,10]),void 0===i&&(i=[0,0]),e.call(this,t,n),this.red=r,this.green=o,this.blue=i}e&&(r.__proto__=e),r.prototype=Object.create(e&&e.prototype),r.prototype.constructor=r;var o={red:{configurable:!0},green:{configurable:!0},blue:{configurable:!0}};return o.red.get=function(){return this.uniforms.red},o.red.set=function(e){this.uniforms.red=e},o.green.get=function(){return this.uniforms.green},o.green.set=function(e){this.uniforms.green=e},o.blue.get=function(){return this.uniforms.blue},o.blue.set=function(e){this.uniforms.blue=e},Object.defineProperties(r.prototype,o),r}(r.Filter);e.RGBSplitFilter=o,Object.defineProperty(e,"__esModule",{value:!0})}),Object.assign(PIXI.filters,this.__filters);
//# sourceMappingURL=filter-rgb-split.js.map
;;/*!
 * @pixi/filter-shockwave - v2.6.1
 * Compiled Thu, 03 May 2018 14:20:43 UTC
 *
 * @pixi/filter-shockwave is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("pixi.js")):"function"==typeof define&&define.amd?define(["exports","pixi.js"],t):t(e.__filters={},e.PIXI)}(this,function(e,t){"use strict";var n="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\n\nuniform vec2 center;\n\nuniform float amplitude;\nuniform float wavelength;\n// uniform float power;\nuniform float brightness;\nuniform float speed;\nuniform float radius;\n\nuniform float time;\n\nconst float PI = 3.14159;\n\nvoid main()\n{\n    float halfWavelength = wavelength * 0.5 / filterArea.x;\n    float maxRadius = radius / filterArea.x;\n    float currentRadius = time * speed / filterArea.x;\n\n    float fade = 1.0;\n\n    if (maxRadius > 0.0) {\n        if (currentRadius > maxRadius) {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n        fade = 1.0 - pow(currentRadius / maxRadius, 2.0);\n    }\n\n    vec2 dir = vec2(vTextureCoord - center / filterArea.xy);\n    dir.y *= filterArea.y / filterArea.x;\n    float dist = length(dir);\n\n    if (dist <= 0.0 || dist < currentRadius - halfWavelength || dist > currentRadius + halfWavelength) {\n        gl_FragColor = texture2D(uSampler, vTextureCoord);\n        return;\n    }\n\n    vec2 diffUV = normalize(dir);\n\n    float diff = (dist - currentRadius) / halfWavelength;\n\n    float p = 1.0 - pow(abs(diff), 2.0);\n\n    // float powDiff = diff * pow(p, 2.0) * ( amplitude * fade );\n    float powDiff = 1.25 * sin(diff * PI) * p * ( amplitude * fade );\n\n    vec2 offset = diffUV * powDiff / filterArea.xy;\n\n    // Do clamp :\n    vec2 coord = vTextureCoord + offset;\n    vec2 clampedCoord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    vec4 color = texture2D(uSampler, clampedCoord);\n    if (coord != clampedCoord) {\n        color *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n\n    // No clamp :\n    // gl_FragColor = texture2D(uSampler, vTextureCoord + offset);\n\n    color.rgb *= 1.0 + (brightness - 1.0) * p * fade;\n\n    gl_FragColor = color;\n}\n",i=function(e){function t(t,i,o){void 0===t&&(t=[0,0]),void 0===i&&(i={}),void 0===o&&(o=0),e.call(this,n,r),this.center=t,Array.isArray(i)&&(console.warn("Deprecated Warning: ShockwaveFilter params Array has been changed to options Object."),i={}),i=Object.assign({amplitude:30,wavelength:160,brightness:1,speed:500,radius:-1},i),this.amplitude=i.amplitude,this.wavelength=i.wavelength,this.brightness=i.brightness,this.speed=i.speed,this.radius=i.radius,this.time=o}e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t;var i={center:{configurable:!0},amplitude:{configurable:!0},wavelength:{configurable:!0},brightness:{configurable:!0},speed:{configurable:!0},radius:{configurable:!0}};return t.prototype.apply=function(e,t,n,r){this.uniforms.time=this.time,e.applyFilter(this,t,n,r)},i.center.get=function(){return this.uniforms.center},i.center.set=function(e){this.uniforms.center=e},i.amplitude.get=function(){return this.uniforms.amplitude},i.amplitude.set=function(e){this.uniforms.amplitude=e},i.wavelength.get=function(){return this.uniforms.wavelength},i.wavelength.set=function(e){this.uniforms.wavelength=e},i.brightness.get=function(){return this.uniforms.brightness},i.brightness.set=function(e){this.uniforms.brightness=e},i.speed.get=function(){return this.uniforms.speed},i.speed.set=function(e){this.uniforms.speed=e},i.radius.get=function(){return this.uniforms.radius},i.radius.set=function(e){this.uniforms.radius=e},Object.defineProperties(t.prototype,i),t}(t.Filter);e.ShockwaveFilter=i,Object.defineProperty(e,"__esModule",{value:!0})}),Object.assign(PIXI.filters,this?this.__filters:__filters);
//# sourceMappingURL=filter-shockwave.js.map
;;/*!
 * @pixi/filter-zoom-blur - v2.6.0
 * Compiled Wed, 28 Feb 2018 22:04:57 UTC
 *
 * @pixi/filter-zoom-blur is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
!function(n,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("pixi.js")):"function"==typeof define&&define.amd?define(["exports","pixi.js"],e):e(n.__filters={},n.PIXI)}(this,function(n,e){"use strict";var t="attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}",r="varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform vec4 filterArea;\n\nuniform vec2 uCenter;\nuniform float uStrength;\nuniform float uInnerRadius;\nuniform float uRadius;\n\nconst float MAX_KERNEL_SIZE = 32.0;\n\nfloat random(vec3 scale, float seed) {\n    // use the fragment position for a different seed per-pixel\n    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);\n}\n\nvoid main() {\n\n    float minGradient = uInnerRadius * 0.3;\n    float innerRadius = (uInnerRadius + minGradient * 0.5) / filterArea.x;\n\n    float gradient = uRadius * 0.3;\n    float radius = (uRadius - gradient * 0.5) / filterArea.x;\n\n    float countLimit = MAX_KERNEL_SIZE;\n\n    vec2 dir = vec2(uCenter.xy / filterArea.xy - vTextureCoord);\n    float dist = length(vec2(dir.x, dir.y * filterArea.y / filterArea.x));\n\n    float strength = uStrength;\n\n    float delta = 0.0;\n    float gap;\n    if (dist < innerRadius) {\n        delta = innerRadius - dist;\n        gap = minGradient;\n    } else if (radius >= 0.0 && dist > radius) { // radius < 0 means it's infinity\n        delta = dist - radius;\n        gap = gradient;\n    }\n\n    if (delta > 0.0) {\n        float normalCount = gap / filterArea.x;\n        delta = (normalCount - delta) / normalCount;\n        countLimit *= delta;\n        strength *= delta;\n        if (countLimit < 1.0)\n        {\n            gl_FragColor = texture2D(uSampler, vTextureCoord);\n            return;\n        }\n    }\n\n    // randomize the lookup values to hide the fixed number of samples\n    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);\n\n    float total = 0.0;\n    vec4 color = vec4(0.0);\n\n    dir *= strength;\n\n    for (float t = 0.0; t < MAX_KERNEL_SIZE; t++) {\n        float percent = (t + offset) / MAX_KERNEL_SIZE;\n        float weight = 4.0 * (percent - percent * percent);\n        vec2 p = vTextureCoord + dir * percent;\n        vec4 sample = texture2D(uSampler, p);\n\n        // switch to pre-multiplied alpha to correctly blur transparent images\n        // sample.rgb *= sample.a;\n\n        color += sample * weight;\n        total += weight;\n\n        if (t > countLimit){\n            break;\n        }\n    }\n\n    color /= total;\n    // switch back from pre-multiplied alpha\n    color.rgb /= color.a + 0.00001;\n\n    gl_FragColor = color;\n}\n",i=function(n){function e(e,i,o,a){void 0===e&&(e=.1),void 0===i&&(i=[0,0]),void 0===o&&(o=0),void 0===a&&(a=-1),n.call(this,t,r),this.center=i,this.strength=e,this.innerRadius=o,this.radius=a}n&&(e.__proto__=n),e.prototype=Object.create(n&&n.prototype),e.prototype.constructor=e;var i={center:{configurable:!0},strength:{configurable:!0},innerRadius:{configurable:!0},radius:{configurable:!0}};return i.center.get=function(){return this.uniforms.uCenter},i.center.set=function(n){this.uniforms.uCenter=n},i.strength.get=function(){return this.uniforms.uStrength},i.strength.set=function(n){this.uniforms.uStrength=n},i.innerRadius.get=function(){return this.uniforms.uInnerRadius},i.innerRadius.set=function(n){this.uniforms.uInnerRadius=n},i.radius.get=function(){return this.uniforms.uRadius},i.radius.set=function(n){(n<0||n===1/0)&&(n=-1),this.uniforms.uRadius=n},Object.defineProperties(e.prototype,i),e}(e.Filter);n.ZoomBlurFilter=i,Object.defineProperty(n,"__esModule",{value:!0})}),Object.assign(PIXI.filters,this.__filters);
//# sourceMappingURL=filter-zoom-blur.js.map
