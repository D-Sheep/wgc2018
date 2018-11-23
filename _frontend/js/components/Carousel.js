// must be attached to window (Babel did it automatically), otherwise Cypress do not see this object
window.Carousel = {
	//============ global properties & methods for all instances ============

	instances: [],
	selectors: {
		root: '.js-carousel',
		slides: '.js-carousel-item',
		anchors: '.js-carousel-anchor',
		prevBtn: '.js-carousel-prev',
		nextBtn: '.js-carousel-next'
	},

	initHandler() {
		$.each($('.js-carousel'), (index, item) => {
			Carousel.make({
				$root: $(item)
			});
		});
	},

	//============ factory function for new instance ============

	make({
		// properties with defaults
		$root = null,
		elements = {},
		options = {
			animation: 'fade', // name of the used animation
			hasControls: false,
			hasAnchors: false,
		}
	} = {}) {
		//============ state definition with computed properties ============

		const {setState, getState} = makeStateHandler({
			state: Object.seal({
				animating: false,
				slidesCount: 0,
				currentSlide: 0,
				get disabled() {
					return getState('slidesCount') === 0;
				}
			}),
			setStateHandler: (property, newValue, oldValue) => {
				// set classes after currentSlide change
				if (property === 'currentSlide') {
					// set proper classes after change
					elements.$slides.removeClass('is-active');
					elements.$anchors.removeClass('is-active');
					elements.$slides.eq(newValue).addClass('is-active');
					elements.$anchors.eq(newValue).addClass('is-active');
				}
			}
		});

		//============ private methods ============

		const bindEvents = () => {
			elements.$prevBtn.click((e) => {
				e.preventDefault();
				changeSlide('prev');
			});

			elements.$nextBtn.click((e) => {
				e.preventDefault();
				changeSlide('next');
			});

			if (options.hasAnchors) {
				elements.$anchors.click((e) => {
					e.preventDefault();
					changeSlide($(e.currentTarget).data('anchor-target'));
				});
			}
		};

		const getNextPrevIndex = (direction) => {
			let target = null;
			const {currentSlide, slidesCount} = getState();

			if (direction === 'next') {
				target = Helpers.mod(currentSlide + 1, slidesCount);
			} else if (direction === 'prev') {
				target = Helpers.mod(currentSlide - 1, slidesCount);
			}

			return target;
		};

		const changeAnimations = ({$currentSlide, $targetSlide, direction, callback}) => {
			if (options.animation === 'fade') {
				const tl = new TimelineMax();
				tl
					.addLabel('fadeOut')
					.staggerTo($currentSlide.children(), 0.4, {
						x: direction * -50,
						opacity: 0,
						ease: Power3.easeIn
					}, 0.1, 'fadeOut')
					.to($currentSlide, 0.4, {opacity: 0}, 'fadeOut')

					.addCallback(callback)

					.addLabel('fadeIn')
					.staggerFromTo($targetSlide.children(), 0.6,
						{x: direction * 50, opacity: 0},
						{x: 0, opacity: 1, ease: Power3.easeOut}, 0.1, 'fadeIn')
					.fromTo($targetSlide, 0.6, {opacity: 0}, {opacity: 1}, 'fadeIn')
				;
			} else if (options.animation === 'smooth') {
				const tl = new TimelineMax();
				tl
					.addLabel('fadeOut')
					.to($currentSlide, 0.4, {scale: 1 + direction * 0.2, opacity: 0}, 'fadeOut')

					.addCallback(callback)

					.addLabel('fadeIn')
					.fromTo($targetSlide, 0.6, {scale: 1 - direction * 0.2, opacity: 0}, {scale: 1, opacity: 1}, 'fadeIn')
				;
			} else {
				throw new Error(`Unknown Carousel animation "${options.animation}".`);
			}
		};

		//============ public methods (add to export) ============

		// `next` / `prev` / int - slide index
		const changeSlide = (targetSlide) => {
			if (getState('animating')) {
				return;
			}

			let directionDecision;
			const {currentSlide} = getState();

			if (targetSlide === 'prev' || targetSlide === 'next') {
				directionDecision = targetSlide === 'next';

				targetSlide = getNextPrevIndex(targetSlide);

				if (targetSlide === null) {
					return;
				}
			} else {
				directionDecision = targetSlide > currentSlide;
			}

			if (currentSlide === targetSlide) {
				return;
			}

			const $currentSlide = elements.$slides.eq(currentSlide);
			const $targetSlide = elements.$slides.eq(targetSlide);
			const direction = directionDecision ? 1 : -1;

			if (!$targetSlide.length) {
				return;
			}

			setState('animating', true);

			const callback = () => {
				setState('currentSlide', targetSlide);
				setState('animating', false);
			};

			changeAnimations({$currentSlide, $targetSlide, direction, callback});
		};

		//============ constructor section ============

		const constructor = () => {
			elements.$root = $root;

			elements.$slides = elements.$root.find(Carousel.selectors.slides);
			elements.$prevBtn = elements.$root.find(Carousel.selectors.prevBtn);
			elements.$nextBtn = elements.$root.find(Carousel.selectors.nextBtn);
			elements.$anchors = elements.$root.find(Carousel.selectors.anchors);

			options.hasControls = !!elements.$prevBtn.length || !!elements.$nextBtn.length;
			options.hasAnchors = !!elements.$anchors.length;
			options.animation = elements.$root.data('animation') || 'fade';

			setState('slidesCount', elements.$slides.length);
			setState('currentSlide', 0);

			bindEvents();

			elements.$root.addClass('is-inited');
		};

		constructor();

		//============ make methods public / autoHandle / push to the `instances` ============

		const publicObject = Object.freeze({
			getState,
			changeSlide
		});

		w.autoHandle(publicObject);
		this.instances.push(publicObject);

		return publicObject;
	}
};

w.autoHandle(Carousel);
