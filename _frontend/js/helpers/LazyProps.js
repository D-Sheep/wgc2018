/* Create a lazy-evaluation wrapper around an object. The properties will be evaluated on their first usage.
 *
 * i.e. `lazy = LazyProps.create({ prop() { return new X(); } });`
 * `lazy.prop` will be an instance of X only after `lazy.prop` has been referenced somewhere. Until that,
 * `lazy` will be an empty object.
 */
const LazyProps = {
	create(obj, thisArg) {
		const res = {};
		Object.keys(obj)
			.filter((key) => Object.prototype.hasOwnProperty.call(obj, key))
			.forEach((key) => {
				Object.defineProperty(res, key, {
					configurable: true,
					enumerable: true,
					get() {
						Object.defineProperty(this, key, { //Define the property with a value of `undefined`
							configurable: true,
							enumerable: true,
							writable: true
						});
						const value = obj[key].call(thisArg); //Call a function that will return the value to be used
						Object.defineProperty(this, key, { //Overwrite the getter with the actual value
							configurable: true,
							enumerable: true,
							writable: true,
							value
						});
						return value;
					},
					set(value) {
						Object.defineProperty(this, key, { //Overwrite getter and setter and store the value
							configurable: true,
							enumerable: true,
							writable: true,
							value
						});
						return value;
					}
				});
			});
		return res;
	}
};
