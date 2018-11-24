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
	"helpers": [
		"js/helpers/Helpers.js", //Helpers have to be first and must not depend on anything
		"js/helpers/Cookies.js",
		"js/helpers/PriorityQueue.js",
		"js/helpers/CallbackQueue.js",
		"js/helpers/LazyProps.js",
		"js/helpers/WebPage.js",
		"js/helpers/Anal.js",
		"js/helpers/Scroll.js",
		"js/helpers/FocusedElementObserver.js"
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
		"js/game/vars.js",
		"js/game/Application.js",
		"js/game/AssetStorage.js",
		"js/game/Controls.js",
		"js/game/Player.js"
	],
	"init": [
		"js/init.js"
	],
	"homepage": [],
	"sample-grid": [
		"js/components/SampleGrid.js"
	]

};
