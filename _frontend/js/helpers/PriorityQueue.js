const PRIORITYQUEUE_DEFAULT_PRIORITY = 0;

class PriorityQueue {
	constructor(comparator) {
		this._comparator = comparator || ((a, b) => a - b); //Sort ascending by default
		this._priorities = []; //List of used priorities, always sorted
		this._queues = {}; //Priority-keyed arrays of queued items
		this._callbacks = {
			onBeforeTransform: [], //Called before (and if) transforming items to be added
			onBeforeAdd: [], //Called before adding (transformed) item (addition can be aborted by returning false)
			onAfterAdd: [], //Called after successfully adding an item
			onBeforeRemove: [], //Called before removing item (removal can be aborted by returning false)
			onAfterRemove: [], //Called after successfully removing an item
		};
		this._flags = {
			dirty: false
		};
		this._cachedQueues = []; //An array of all concatenated queues is kept here (result of .getAll())
		this._privateCallbacks = {
			onBeforeAdd: []
		};
		this._transformers = null; //This will be a CallbackQueue holding all input transformers
		this.length = 0; //Total length of the queue (number of items queued)
	}

	//Add an item
	add(object, priority, ...args) {
		if (typeof priority === 'function') {
			priority = priority();
		}
		if (typeof priority !== 'number') {
			priority = PRIORITYQUEUE_DEFAULT_PRIORITY;
		}
		if (this._transformers !== null) {
			if (this._callbacks.onBeforeTransform.every((cb) => cb(object, priority, ...args) !== false)) { //Transformation can be aborted
				object = this._transformers.getAll().reduce((obj, transformer) => transformer(obj, priority, ...args), object); //Apply all transformers sequentially
			}
		}
		this._privateCallbacks.onBeforeAdd.forEach((cb) => cb(object, priority, ...args));
		if (this._callbacks.onBeforeAdd.every((cb) => cb(object, priority, ...args) !== false)) { //Addition can be aborted
			this._getQueue(priority, true).push(object);
			this.length++;
			this._callbacks.onAfterAdd.forEach((cb) => cb(object, priority, ...args));
			this._flags.dirty = true;
			return object; //Return the new (transformed) item
		}
		return undefined;
	}

	//Remove an item
	remove(object) {
		if (this._callbacks.onBeforeRemove.every((cb) => cb(object) !== false)) { //Removal can be aborted
			this.length = this._priorities.reduce((sum, priority) =>
				sum + this._setQueue(priority, this._getQueue(priority).filter((obj) => obj !== object)).length, 0);
			this._callbacks.onAfterRemove.forEach((cb) => cb(object));
		}
		return this;
	}

	//Set a different priority for a queued item
	setPriority(object, priority) {
		this.remove(object).add(object, priority);
		this._flags.dirty = true;
		return this;
	}

	//Set a new priority for all items with some old priority
	reassignPriority(oldPriority, newPriority) {
		if (this._priorities.indexOf(oldPriority) !== -1) { //If such old priority exists
			if (this._priorities.indexOf(newPriority) === -1) { //No queue with such new priority yet
				this._priorities.push(newPriority); //Add new priority to the list
				this._priorities.sort(this._comparator); //Sort the priorities
				this._setQueue(newPriority, this._getQueue(oldPriority));
			} else { //Both priorities in use, concatenate the two queues
				this._setQueue(newPriority, this._getQueue(newPriority).concat(this._getQueue(oldPriority)));
			}
			this._priorities.splice(this._priorities.indexOf(oldPriority), 1); //Remove old priority, list is still sorted
		}
		return this;
	}

	//Get all queued items in an array, possibly filtered by a priority
	getAll(priority) {
		if (typeof priority === 'number') {
			return this._getQueue(priority);
		}
		if (this._flags.dirty) {
			this._cachedQueues = this._priorities.reduce((res, p) => res.concat(this._getQueue(p)), []); //Concatenate all partial queues into one
			this._flags.dirty = false;
		}
		return this._cachedQueues;
	}

	getHighestPriority() {
		return this._priorities.length ? this._priorities[0] : PRIORITYQUEUE_DEFAULT_PRIORITY;
	}

	getLowestPriority() {
		return this._priorities.length ? this._priorities[this._priorities.length - 1] : PRIORITYQUEUE_DEFAULT_PRIORITY;
	}

	//Add a callback to be fired before transforming new items
	onBeforeTransform(callback) {
		this._callbacks.onBeforeTransform.push(callback);
		return this;
	}

	//Add a callback to be fired before adding new (already transformed) items
	onBeforeAdd(callback) {
		this._callbacks.onBeforeAdd.push(callback);
		return this;
	}

	//Add a callback to be fired after successfully adding a new item
	onAfterAdd(callback) {
		this._callbacks.onAfterAdd.push(callback);
		return this;
	}

	//Add a callback to be fired before removing an item
	onBeforeRemove(callback) {
		this._callbacks.onBeforeRemove.push(callback);
		return this;
	}

	//Add a callback to be fired after successfully removing an item
	onAfterRemove(callback) {
		this._callbacks.onAfterRemove.push(callback);
		return this;
	}

	//Add a transformer function to modify any new items being added
	addTransformer(transformer, priority) {
		if (this._transformers === null) {
			this._transformers = new CallbackQueue();
		}
		this._transformers.add(transformer, priority);
		return this;
	}

	//========================================================

	//Get or create a new partial queue for a certain priority
	_getQueue(priority, createNew = false) {
		if (this._priorities.indexOf(priority) === -1) { //No queue with such priority yet
			if (!createNew) {
				return [];
			}
			this._priorities.push(priority); //Add the priority to the list
			this._priorities.sort(this._comparator); //Sort the list
			this._setQueue(priority, []); //The new queue is empty
		}
		return this._queues[priority];
	}

	//Assign a partial queue to a certain priority
	_setQueue(priority, queue) {
		this._flags.dirty = true;
		this._queues[priority] = queue;
		return queue;
	}
}
