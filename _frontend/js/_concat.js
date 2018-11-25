/**
 * Každý klíč se vybuildí (a zminifikuje) do souboru /assets/dist/js/{key}.js
 */

module.exports = {
	"head": [],
	"polyfills": [
		"js/polyfills.js",
		//"node_modules/regenerator-runtime/runtime.js", //Enable this if you want to use async/await
		//"node_modules/promise-polyfill/dist/polyfill.min.js", //Enable this if you want to use Promises
	],
	"libs": [
		"node_modules/bowser/bowser.js",
		"node_modules/lodash/lodash.min.js",
		"node_modules/moment/min/moment-with-locales.js",
		"node_modules/css-element-queries/src/ResizeSensor.js",
		"node_modules/css-element-queries/src/ElementQueries.js",
		"node_modules/sweetalert2/dist/sweetalert2.min.js",
        "node_modules/pixi.js/dist/pixi.js"
	],
	"libs-gsap": [
		"js/libs/gsap/TweenMax.min.js",
		"js/libs/gsap/plugins/ScrollToPlugin.min.js",
		"js/libs/gsap/plugins/ModifiersPlugin.min.js",
		"js/libs/gsap/utils/Draggable.min.js",
		"js/libs/gsap/utils/SplitText.min.js",
		"js/libs/gsap/utils/GSDevTools.min.js"
	],
	"libs-jquery": [
		"node_modules/jquery/dist/jquery.min.js"
	],
	// service worker
	"libs-serviceworker": [
		"node_modules/upup/dist/upup.sw.min.js"
	],
	"libs-serviceworker-modules": [
		"node_modules/upup/dist/upup.min.js"
	],
	"libs-vue": [
		"node_modules/vue/dist/vue.js"
	],
	"libs-pixi": [
        "js/libs/pixi/pixi-rectangle-intersects.js",
        "js/libs/pixi/pixi-point-distance.js",
        "js/libs/pixi/pixi-point-add.js"
	],
	"helpers": [
		"js/helpers/Helpers.js", //Helpers have to be first and must not depend on anything
		"js/helpers/PriorityQueue.js",
		"js/helpers/CallbackQueue.js",
		"js/helpers/LazyProps.js",
		"js/helpers/WebPage.js"
	],
	"common": [
		"js/common.js",

		"js/components/helpers/StateHandler.js",
		"js/components/helpers/AbstractContentSwitcher.js",
		"js/components/helpers/PromiseMax.js",
		"js/components/Carousel.js",
		"js/components/Modal.js",
		"js/components/Tabs.js",
	],
	"game": [
        "js/game/gameobjects/GameObject.js",
        "js/game/gameobjects/WalkingEnemy.js",
        "js/game/gameobjects/AirConditioning.js",
        "js/game/gameobjects/GreenTurtle.js",
        "js/game/gameobjects/RedTurtle.js",
        "js/game/gameobjects/Coins.js",
        "js/game/gameobjects/FinishHouse.js",
        "js/game/gameobjects/Finish.js",
        "js/game/gameobjects/RedMushroom.js",
        "js/game/gameobjects/GreenMushroom.js",
        "js/game/gameobjects/Poop.js",

        "js/game/vars.js",
        "js/game/Application.js",
        "js/game/AssetStorage.js",
        "js/game/Controls.js",
        "js/game/Ledge.js",
        "js/game/Block.js",
        "js/game/Player.js",
        "js/game/Camera.js",
        "js/game/CollisionManager.js",
        "js/game/MapSection.js",
        "js/game/MapSectionStorage.js",
		"js/game/GameObjectFactory.js"
	],
	"init": [
		"js/init.js"
	],
	"homepage": [],
	"sample-grid": [
		"js/components/SampleGrid.js"
	]

};
