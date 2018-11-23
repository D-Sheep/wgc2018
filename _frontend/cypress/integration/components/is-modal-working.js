const env = require('../../../_env');

describe('Modal is working', function () {

	let Modal = null;

	before(function () {
		cy.visit(env.PROXY + '/components');

		cy.window().then((innerWindow) => {
			Modal = innerWindow.Modal;
			innerWindow.console = console;
		});
	});

	it('Initializes', function () {
		expect(Modal).to.have.property('instances');
		expect(Modal.instances).with.lengthOf(1);
		expect(Modal.instances[0].getState('animating')).to.be.false;
		expect(Modal.instances[0].getState('currentModal')).to.be.null;
		expect(Modal.instances[0].getState('changeAllowed')).to.be.true;
	});

	it('Opens, changes and closes modal', function () {
		cy.wrap(Modal.instances[0]).as('instance');

		cy.get('.js-modal').eq(0).as('modal');
		cy.get('@modal').find('.js-modal-item').eq(0).as('item01');
		cy.get('@modal').find('.js-modal-item').eq(1).as('item02');
		cy.get('@modal').find('.js-modal-item').eq(2).as('item03');
		cy.get('.js-modal-anchor').eq(0).as('anchor01');
		cy.get('.js-modal-anchor').eq(1).as('anchor02');
		cy.get('.js-modal-anchor').eq(2).as('anchor03');

		cy.get('@item01').should('not.have.class', 'is-active');
		cy.get('@item02').should('not.have.class', 'is-active');
		cy.get('@item03').should('not.have.class', 'is-active');

		//Open modal 1
		cy.get('@anchor01').click();
		cy.get('@instance').invoke('getState', 'open').should('be.true');
		cy.get('@instance').invoke('getState', 'animating').should('be.true');
		cy.get('@instance').invoke('getState', 'changeAllowed').should('be.false');
		cy.get('@instance').invoke('getState', 'changeAllowed').should('be.true');
		cy.get('@instance').invoke('getState', 'currentModal').should('eq', 0);
		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@item01').should('have.class', 'is-active');
		cy.get('@item02').should('not.have.class', 'is-active');
		cy.get('@item03').should('not.have.class', 'is-active');

		//Change to modal 2
		cy.get('@item01').find('.js-modal-anchor').eq(1).click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');
		cy.get('@instance').invoke('getState', 'changeAllowed').should('be.false');
		cy.get('@instance').invoke('getState', 'changeAllowed').should('be.true');
		cy.get('@instance').invoke('getState', 'currentModal').should('eq', 1);
		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@item01').should('not.have.class', 'is-active');
		cy.get('@item02').should('have.class', 'is-active');
		cy.get('@item03').should('not.have.class', 'is-active');

		//Change to modal 3
		cy.get('@item02').find('.js-modal-anchor').eq(2).click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');
		cy.get('@instance').invoke('getState', 'changeAllowed').should('be.false');
		cy.get('@instance').invoke('getState', 'changeAllowed').should('be.true');
		cy.get('@instance').invoke('getState', 'currentModal').should('eq', 2);
		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@item01').should('not.have.class', 'is-active');
		cy.get('@item02').should('not.have.class', 'is-active');
		cy.get('@item03').should('have.class', 'is-active');

		//Close modal
		cy.get('@item03').find('.js-modal-close').click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');
		cy.get('@instance').invoke('getState', 'changeAllowed').should('be.false');
		cy.get('@instance').invoke('getState', 'changeAllowed').should('be.true');
		cy.get('@instance').invoke('getState', 'currentModal').should('be.null');
		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@instance').invoke('getState', 'open').should('be.false');
		cy.get('@item01').should('not.have.class', 'is-active');
		cy.get('@item02').should('not.have.class', 'is-active');
		cy.get('@item03').should('not.have.class', 'is-active');
	});

	it('Closes modal by clicking on the backdrop', function () {
		cy.wrap(Modal.instances[0]).as('instance');

		cy.get('.js-modal').eq(0).as('modal');
		cy.get('@modal').find('.js-modal-backdrop').as('backdrop');
		cy.get('@modal').find('.js-modal-item').eq(0).as('item01');
		cy.get('.js-modal-anchor').eq(0).as('anchor01');

		cy.get('@anchor01').click();
		cy.get('@instance').invoke('getState', 'currentModal').should('eq', 0);
		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@backdrop').click('right', { force: true });
		cy.get('@instance').invoke('getState', 'open').should('be.false');
	});

	it('Closes modal by pressing escape', function () {
		cy.wrap(Modal.instances[0]).as('instance');

		cy.get('.js-modal').eq(0).as('modal');
		cy.get('@modal').find('.js-modal-backdrop').as('backdrop');
		cy.get('@modal').find('.js-modal-item').eq(0).as('item01');
		cy.get('.js-modal-anchor').eq(0).as('anchor01');

		cy.get('@anchor01').click();
		cy.get('@instance').invoke('getState', 'currentModal').should('eq', 0);
		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('body').type('{esc}');
		cy.get('@instance').invoke('getState', 'open').should('be.false');
	});
});
