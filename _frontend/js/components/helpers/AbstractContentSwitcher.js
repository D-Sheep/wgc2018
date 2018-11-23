/*
 * Typical parameters of common components:
 *
 *						+---------canNavigateToCurrent
 *						| +-------canNavigateNextPrev
 *						| | +-----canShowMultiple
 *						| | | +---canLoop
 *						| | | |
 * Modal				F F F X
 * Tabs					F F F X
 * Accordion			F F T X
 * Carousel				F T F F
 * Looping Carousel		F T F T
 *
 * T: true, F: false, X: don't care
 */

const makeAbstractContentSwitcher = ({
	canNavigateToCurrent = false, //When true, navigating to currently visible content triggers a change
	canNavigateNextPrev = false, //When true, enables navigation relative to currently visible content (next and previous)
	canShowMultiple = false, //When true, multiple contents can be visible at the same time (useful in accordions)
	canLoop = false, //When true, next/prev navigation loops around from last to first (only relevant with canNavigateNextPrev = true)
	contentCount = 0, //How many contents are there to switch between (only relevant with canNavigateNextPrev = true)
} = {}) => {
	if (canShowMultiple && canNavigateNextPrev) {
		throw new Error('Tabs cannot show multiple tabs and enable next/prev navigation at the same time.');
	}

	const isNextAllowed = (current) => canNavigateNextPrev && (canLoop || current < contentCount - 1);

	const isPrevAllowed = (current) => canNavigateNextPrev && (canLoop || current > 0);

	const getNextPrevIndex = (current, direction) => {
		if (direction === 'next' && isNextAllowed(current)) {
			return Helpers.mod(current + 1, contentCount);
		}
		if (direction === 'prev' && isPrevAllowed(current)) {
			return Helpers.mod(current - 1, contentCount);
		}
		return null;
	};

	return (from, to) => {
		if (canShowMultiple) {
			return {
				from,
				to,
				direction: 0 //Direction is meaningless when showing multiple tabs
			};
		}

		let directionDecision;

		if (to === 'next' || to === 'prev') {
			if (!canNavigateNextPrev) {
				return null;
			}

			directionDecision = to === 'next';
			to = getNextPrevIndex(from, to);

			if (to === null) {
				return null;
			}
		} else {
			directionDecision = to > from;
		}

		if (!canNavigateToCurrent && from === to) {
			return null;
		}

		return {
			from,
			to,
			direction: directionDecision ? 1 : -1
		};
	};
};
