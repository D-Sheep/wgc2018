const Helpers = {
	//Choose a random number from an interval, including both ends
	rnd(from, to, except) {
		let rnd;
		do {
			rnd = Math.floor(Math.random() * (to - from + 1)) + from;
		} while (typeof except !== 'undefined' && except === rnd);
		return rnd;
	},

	//Shuffles an array in-place
	shuffle(array) {
		let counter = array.length;
		while (counter > 0) {
			const index = Math.floor(Math.random() * counter--);
			const temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}
		return array;
	},

	//Choose a random element from array `items`
	choose: (items) => (items.length ? items[Math.floor(Math.random() * items.length)] : null),

	//Returns -1 or 1 randomly, optionally multiplied by `x`
	randomSign: (x = 1) => x * (Math.random() < 0.5 ? 1 : -1),

	//Returns -1 if `x` is positive, 1 otherwise
	negativeSign: (x) => (x > 0 ? -1 : 1),

	//Returns the fractional part of a number
	frac: (x) => x - Math.floor(x),

	//Calculates horizontal length of vector (distance, angle)
	distX: (distance, angle) => Math.cos(angle) * distance,

	//Calculates vertical length of vector (distance, angle)
	distY: (distance, angle) => -Math.sin(angle) * distance,

	//Returns the sign of a number (-1, 0 or 1)
	sign: (x) => ((+x === 0 || Number.isNaN(+x)) ? Number(x) : (x > 0 ? 1 : -1)),

	//Calculates correct modulo even for negative numbers
	mod: (n, mod) => ((n % mod) + mod) % mod,

	//Works like Array.reduce but iterates `num` times
	reduceNumber: (num, fn, val) => (num ? fn(Helpers.reduceNumber(--num, fn, val), num) : val),

	//Returns a parameter value from current url
	getURLParameter: (name) => decodeURIComponent((new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`).exec(window.location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null,

	//Pads `number` with zeroes to a minimum length `len`
	getZeroInt: (num, len = 2) => Helpers.reduceNumber(Math.max(0, len - (`${num}`).length), (s) => `0${s}`, `${num}`),

	// apply many functions to one arguments (https://medium.com/front-end-hacking/pipe-and-compose-in-javascript-5b04004ac937)
	pipe: (...fns) => (x) => fns.reduce((v, f) => f(v), x)
};
