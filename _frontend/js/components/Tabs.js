window.Tabs = {

	//============ global properties & methods for all instances ============

	instances: [],
	selectors: {
		root: '.js-tabs',
		tabs: '.js-tabs-item',
		anchors: '.js-tabs-anchor',
	},

	initHandler() {
		$(Tabs.selectors.root).each((index, item) => {
			Tabs.make({
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
			canShowMultiple: false //When true, the component behaves like accordion (with 'stretch' animation)
		}
	} = {}) {
		//=========================== clone arguments passed by reference ===========================

		elements = Object.assign({}, elements);
		options = Object.seal(Object.assign({}, options));

		//============ state definition ============

		const {setState, getState} = makeStateHandler({
			state: Object.seal({
				animating: false,
				tabCount: 0,
				changeAllowed: true,
				set currentTab(value) {
					if (options.canShowMultiple) {
						const tabIndex = currentTab.indexOf(value);

						if (tabIndex !== -1) {
							currentTab.splice(tabIndex, 1);
						} else {
							currentTab.push(value);
						}
					} else {
						currentTab[0] = value;
					}
				},
				get currentTab() {
					if (options.canShowMultiple) {
						return currentTab.slice(); //Make a copy
					}
					return currentTab[0];
				}
			}),
			setStateHandler: (property, newValue, oldValue) => {
				// set classes after currentSlide change
				if (property === 'currentTab') {
					// set proper classes after change

					if (!options.canShowMultiple) {
						elements.$tabs.removeClass('is-active');
						elements.$anchors.removeClass('is-active');
					}
					elements.$tabs.eq(newValue).toggleClass('is-active');
					getAnchorsThatTargetTab(newValue).toggleClass('is-active');
				}
			}
		});

		//============ private methods ============

		const bindEvents = () => {
			elements.$anchors.click((e) => {
				e.preventDefault();
				changeTab($(e.currentTarget).data('anchor-target'));
			});
		};

		const changeAnimations = (
			$leave,
			$enter,
			direction,
			changeLogic
		) => {
			setState('animating', true);

			const tl = new PromiseMax();

			if (options.animation === 'fade') { //Use this for tabs
				if ($leave !== null) {
					tl
						.to($leave, 0.4, {opacity: 0})
						.set($leave, {height: 0})
						.set($leave, {clearProps: 'opacity'}) //Separated from previous .set to prevent glitches
					;
				}
				tl.add(changeLogic);
				if ($enter !== null) {
					tl
						.set($enter, {clearProps: 'height'})
						.from($enter, 0.6, {opacity: 0, clearProps: 'opacity'})
					;
				}
			} else if (options.animation === 'stretch') { //Use this for accordion
				if ($leave !== null) {
					tl.to($leave, 1, {height: 0}, 0);
				}
				tl.add(changeLogic);
				if ($enter !== null) {
					tl
						.set($enter, {clearProps: 'height'}, 0)
						.from($enter, 1, {height: 0, clearProps: 'height'}, 0)
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

		const getAnchorsThatTargetTab = (tab) =>
			elements.$tabs.filter(
				(index, el) =>
					getTabIndex($(el).data('anchor-target')) === getTabIndex(tab)
			);

		const getTabIndex = (tab) => {
			if (typeof tab === 'string') {
				return elements.$tabs.index(elements.$tabs.filter((index, el) => $(el).data('name') === tab));
			}
			return tab;
		};

		//============ public methods (add to export) ============

		/**
		 * Change current tab
		 * @param {Number|string} targetTab
		 * @param {Function} [afterChangeCallback]
		 */
		const changeTab = async (
			targetTab,
			afterChangeCallback = () => {},
		) => {
			if (!getState('changeAllowed')) {
				return;
			}

			const currentTab = getState('currentTab');
			targetTab = getTabIndex(targetTab);

			const switchingData = switchContent(currentTab, targetTab);

			if (!switchingData) {
				return;
			}

			setState('changeAllowed', false);

			let $leave;
			let $enter;

			if (options.canShowMultiple) {
				const isTargetTabActive = getState('currentTab').indexOf(switchingData.to) !== -1;

				$leave = isTargetTabActive ? elements.$tabs.eq(switchingData.to) : null;
				$enter = isTargetTabActive ? null : elements.$tabs.eq(switchingData.to);
			} else {
				$leave = elements.$tabs.eq(currentTab);
				$enter = elements.$tabs.eq(switchingData.to);
			}

			await changeAnimations($leave, $enter, switchingData.direction, () => {
				setState({
					currentTab: switchingData.to,
					changeAllowed: true,
				});
				afterChangeCallback();
			});
		};

		/**
		 * Set any option to change behaviour during run-time
		 * @param {string} option
		 * @param {*} value
		 */
		const setOption = (option, value) => {
			options[option] = value;
		};

		//============ constructor section ============

		elements.$root = $root;

		elements.$tabs = elements.$root.find(Tabs.selectors.tabs);
		elements.$anchors = elements.$root.find(Tabs.selectors.anchors);
		options.animation = elements.$root.data('animation') || 'fade';
		options.canShowMultiple = elements.$root.data('show-multiple') || false;

		const initialTab = 0;
		const currentTab = []; //This actually holds the real value of state's currentTab
		const switchContent = makeAbstractContentSwitcher({
			canShowMultiple: options.canShowMultiple,
		});

		elements.$tabs.not((index) => index === initialTab).css({height: 0}); //Hide all tabs except the current one

		setState('currentTab', initialTab);

		bindEvents();

		elements.$root.addClass('is-inited');

		//============ make methods public / autoHandle / push to the `instances` ============

		const publicObject = Object.freeze({
			getState,
			changeTab,
			setOption,
		});

		w.autoHandle(publicObject);
		Tabs.instances.push(publicObject);

		return publicObject;
	}
};

w.autoHandle(Tabs);
