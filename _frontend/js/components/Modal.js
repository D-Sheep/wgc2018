window.Modal = {

	//============ global properties & methods for all instances ============

	instances: [],
	selectors: {
		root: '.js-modal',
		backdrop: '.js-modal-backdrop',
		modals: '.js-modal-item',
		anchors: '.js-modal-anchor',
		close: '.js-modal-close',
	},

	initHandler() {
		$(Modal.selectors.root).each((index, item) => {
			Modal.make({
				$root: $(item)
			});
		});
	},

	//============ factory function for new instance ============

	make({
		$root = null,
		elements = {},
		options = {
			animation: 'fade', //Name of the used animation
		}
	} = {}) {
		//Clone arguments passed by reference
		elements = Object.assign({}, elements);
		options = Object.seal(Object.assign({}, options));

		//============ state definition ============

		const {setState, getState} = makeStateHandler({
			state: Object.seal({
				animating: false,
				changeAllowed: true,
				currentModal: null,
				open: false,
			}),
			setStateHandler: (property, newValue, oldValue) => {
				if (property === 'currentModal') {
					//Set proper classes after change
					elements.$modals.removeClass('is-active');
					elements.$anchors.removeClass('is-active');

					if (newValue !== null) {
						elements.$modals.eq(newValue).toggleClass('is-active');
						getAnchorsThatTargetModal(newValue).toggleClass('is-active');
					}
				}
			}
		});

		//============ public methods (add to export) ============

		/**
		 * Open a specific modal
		 * @param {string|Number} modal
		 * @param {Function} [afterChangeCallback]
		 */
		const openModal = async (
			modal,
			afterChangeCallback = () => {}
		) => {
			if (!getState('changeAllowed')) {
				return;
			}

			const currentModal = getState('currentModal');
			const targetModal = getModalIndex(modal);
			const switchingData = switchContent(currentModal, targetModal);

			if (!switchingData) {
				return;
			}

			setState('changeAllowed', false);

			if (!getState('open')) { //First show the backdrop, then open the modal
				await showBackdrop();
			}

			const $leave = currentModal !== null ? elements.$modals.eq(currentModal) : null;
			const $enter = elements.$modals.eq(switchingData.to);

			await changeAnimations($leave, $enter, switchingData.direction, () => {
				setState({
					currentModal: switchingData.to,
					changeAllowed: true,
				});
				afterChangeCallback();
			});
		};

		/**
		 * Close any modal that is currently open
		 * @param {Function} [afterChangeCallback]
		 */
		const closeModal = async (afterChangeCallback = () => {}) => {
			if (getState('animating') || !getState('open') || !getState('changeAllowed')) {
				return;
			}

			const currentModal = getState('currentModal');
			const switchingData = switchContent(currentModal, null);

			if (!switchingData) {
				return;
			}

			setState('changeAllowed', false);

			const $leave = elements.$modals.eq(currentModal);

			await changeAnimations($leave, null, switchingData.direction, () => {
				setState({
					currentModal: null,
					changeAllowed: true,
				});
				afterChangeCallback();
			});
			await hideBackdrop();
		};

		/**
		 * Set an option to modify behavior during run-time
		 * @param {string} option
		 * @param {*} value
		 */
		const setOption = (option, value) => {
			options[option] = value;
		};

		//============ private methods ============

		const bindEvents = () => {
			elements.$anchors.click((e) => {
				e.preventDefault();
				openModal($(e.currentTarget).data('anchor-target'));
			});
			elements.$close.click((e) => {
				e.preventDefault();
				closeModal();
			});
			elements.$root.click((e) => {
				e.preventDefault();
				closeModal();
			});
			elements.$modals.click((e) => {
				e.stopPropagation();
			});

			w.callbacks.keyboard.add(() => {
				closeModal();
			}, PRIORITYQUEUE_DEFAULT_PRIORITY, 27); //Close on Escape
		};

		const changeAnimations = (
			$leave,
			$enter,
			direction,
			changeLogic
		) => {
			setState('animating', true);

			const tl = new PromiseMax();

			if ($leave !== null) {
				TweenMax.killTweensOf($leave);
			}
			if ($enter !== null) {
				TweenMax.killTweensOf($enter);
			}

			if (options.animation === 'fade') { //Use this for tabs
				if ($leave !== null) {
					tl
						.to($leave, 0.4, {opacity: 0, y: -50})
						.set($leave, {height: 0})
					;
				}
				tl.add(changeLogic);
				if ($enter !== null) {
					tl
						.set($enter, {clearProps: 'height'})
						.fromTo($enter, 0.6, {opacity: 0, y: -50}, {opacity: 1, y: 0})
					;
				}
			} else {
				throw new Error(`Unknown tab animation "${options.animation}"`);
			}

			tl
				.add(() => {
					setState('animating', false);
				})
				.resolve()
			;

			return tl;
		};

		const enablePageScrolling = (enable) => {
			$('.page__wrap').css({marginRight: w.getScrollbarWidth() * !enable});
			w.$html.toggleClass('is-scroll-fixed', !enable);
		};

		const showBackdrop = () => new PromiseMax()
			.add(() => {
				setState({
					animating: true,
					open: true
				});
			})
			.set(elements.$root, {clearProps: 'height'})
			.fromTo(elements.$backdrop, 0.5, {opacity: 0}, {opacity: 1})
			.add(() => {
				enablePageScrolling(false);
				setState('animating', false);
			})
			.resolve()
		;

		const hideBackdrop = () => new PromiseMax()
			.add(() => {
				setState('animating', true);
				enablePageScrolling(true);
			})
			.to(elements.$backdrop, 0.5, {opacity: 0})
			.set(elements.$root, {height: 0})
			.add(() => {
				setState({
					animating: false,
					open: false,
				});
			})
			.resolve()
		;

		const getAnchorsThatTargetModal = (modal) =>
			elements.$anchors.filter(
				(index, el) =>
					getModalIndex($(el).data('anchor-target')) === getModalIndex(modal)
			);

		const getModalIndex = (modal) => {
			if (typeof modal === 'string') {
				//Return index of the first modal whose name matches
				return elements.$modals.index(elements.$modals.filter((index, el) => $(el).data('name') === modal));
			}
			return modal;
		};

		//============ constructor section ============

		elements.$root = $root;

		elements.$modals = elements.$root.find(Modal.selectors.modals);
		elements.$anchors = $(Modal.selectors.anchors);
		elements.$backdrop = elements.$root.find(Modal.selectors.backdrop);
		elements.$close = elements.$root.find(Modal.selectors.close);
		options.animation = elements.$root.data('animation') || 'fade';
		options.canShowMultiple = elements.$root.data('show-multiple') || false;

		TweenMax.set(elements.$root, {height: 0});
		TweenMax.set(elements.$modals, {height: 0});

		const switchContent = makeAbstractContentSwitcher();

		bindEvents();

		elements.$root.addClass('is-inited');

		//============ make methods public / autoHandle / push to the `instances` ============

		const publicObject = Object.freeze({
			getState,
			openModal,
			closeModal,
			setOption,
		});

		w.autoHandle(publicObject);
		Modal.instances.push(publicObject);

		return publicObject;
	}
};

w.autoHandle(Modal);
