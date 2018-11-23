const makeStateHandler = (
	{
		state = {},
		setStateHandler = () => {}
	} = {}
) => {
	const propertiesChanged = new Set();

	const processSetState = (property, value) => {
		if (propertiesChanged.has(property)) {
			throw new Error(`Detected setState() infinite loop when setting "${property}"`);
		}

		const oldValue = getState(property);

		state[property] = value;

		propertiesChanged.add(property);
		setStateHandler(property, value, oldValue);
		propertiesChanged.delete(property);
	};

	//======================================================

	const setState = (property, value) => {
		if (typeof property !== 'string' && typeof value === 'undefined') {
			Object.keys(property).forEach((prop) => {
				processSetState(prop, property[prop]);
			});
		} else {
			processSetState(property, value);
		}
	};

	const getState = (item) => {
		if (typeof item === 'undefined') {
			// `assign` to still make `state` writable; `freeze` to prevent changing from outer space :)
			return Object.freeze(Object.assign({}, state));
		}
		if (Object.prototype.hasOwnProperty.call(state, item)) {
			return state[item];
		}

		throw new Error(`Unknown property name "${item}" in getState()`);
	};

	return Object.freeze({
		setState,
		getState
	});
};
