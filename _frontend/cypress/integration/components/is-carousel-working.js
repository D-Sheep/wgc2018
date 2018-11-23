const env = require('../../../_env');

describe('Is Carousel working', function () {

	let Carousel = null;

	before(function () {
		cy.visit(env.PROXY + '/components');

		cy.window().then((innerWindow) => {
			Carousel = innerWindow.Carousel;
		});
	});

	it('Is Carousel inited correctly', function () {
		expect(Carousel).to.have.property('instances');
		expect(Carousel.instances).with.lengthOf(2);
		expect(Carousel.instances[0].getState('animating')).to.equal(false);
		expect(Carousel.instances[0].getState('currentSlide')).to.equal(0);
	});

	it('Is Carousel changeSlide() method working', function () {
		cy.get('.js-carousel-item').eq(0).as('item01');
		cy.get('.js-carousel-item').eq(1).as('item02');
		cy.get('.js-carousel-item').eq(2).as('item03');
		cy.get('.js-carousel-next').eq(0).as('button');
		cy.get('.js-carousel-anchor').eq(0).as('anchor');

		cy.get('@item01').should('have.class', 'is-active');

		cy.get('@button').click().then(function () {
			expect(Carousel.instances[0].getState('animating')).to.equal(true);
		});
		cy.get('@item02').should('have.class', 'is-active');

		cy.get('@button').click();
		cy.get('@item02').should('not.have.class', 'is-active');
		cy.get('@item03').should('have.class', 'is-active');

		cy.get('@anchor').click().then(function () {
			expect(Carousel.instances[0].getState('animating')).to.equal(true);
		});
		cy.get('@item03').should('not.have.class', 'is-active');
		cy.get('@item01').should('have.class', 'is-active');
	});
});
