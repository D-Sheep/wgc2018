const env = require('../../../_env');

describe('Tabs are working', function () {

	let Tabs = null;

	before(function () {
		cy.visit(env.PROXY + '/components');

		cy.window().then((innerWindow) => {
			Tabs = innerWindow.Tabs;
		});
	});

	it('Initializes', function () {
		expect(Tabs).to.have.property('instances');
		expect(Tabs.instances).with.lengthOf(2);
		expect(Tabs.instances[0].getState('animating')).to.equal(false);
		expect(Tabs.instances[0].getState('currentTab')).to.equal(0);
		expect(Tabs.instances[1].getState('animating')).to.equal(false);
		expect(Tabs.instances[1].getState('currentTab')).to.eql([0]);
	});

	it('Changes tabs (single)', function () {
		cy.wrap(Tabs.instances[0]).as('instance');

		cy.get('.js-tabs').eq(0).as('tabs');
		cy.get('@tabs').find('.js-tabs-item').eq(0).as('item01');
		cy.get('@tabs').find('.js-tabs-item').eq(1).as('item02');
		cy.get('@tabs').find('.js-tabs-item').eq(2).as('item03');
		cy.get('@tabs').find('.js-tabs-anchor').eq(0).as('anchor01');
		cy.get('@tabs').find('.js-tabs-anchor').eq(1).as('anchor02');
		cy.get('@tabs').find('.js-tabs-anchor').eq(2).as('anchor03');

		cy.get('@item01').should('have.class', 'is-active');
		cy.get('@item02').should('not.have.class', 'is-active');
		cy.get('@item03').should('not.have.class', 'is-active');

		//Change to tab 2
		cy.get('@anchor02').click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');

		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@instance').invoke('getState', 'currentTab').should('equal', 1);
		cy.get('@item02').should('have.class', 'is-active');
		cy.get('@item01').should('not.have.class', 'is-active');

		cy.wait(100);

		//Change to tab 3
		cy.get('@anchor03').click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');

		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@instance').invoke('getState', 'currentTab').should('equal', 2);
		cy.get('@item03').should('have.class', 'is-active');
		cy.get('@item02').should('not.have.class', 'is-active');

		cy.wait(100);

		//Change to tab 1
		cy.get('@anchor01').click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');

		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@instance').invoke('getState', 'currentTab').should('equal', 0);
		cy.get('@item01').should('have.class', 'is-active');
		cy.get('@item03').should('not.have.class', 'is-active');
	});

	it('Changes tabs (multiple)', function () {
		cy.wrap(Tabs.instances[1]).as('instance');

		cy.get('.js-tabs').eq(1).as('tabs');
		cy.get('@tabs').find('.js-tabs-item').eq(0).as('item01');
		cy.get('@tabs').find('.js-tabs-item').eq(1).as('item02');
		cy.get('@tabs').find('.js-tabs-item').eq(2).as('item03');
		cy.get('@tabs').find('.js-tabs-anchor').eq(0).as('anchor01');
		cy.get('@tabs').find('.js-tabs-anchor').eq(1).as('anchor02');
		cy.get('@tabs').find('.js-tabs-anchor').eq(2).as('anchor03');

		cy.get('@item01').should('have.class', 'is-active');
		cy.get('@item02').should('not.have.class', 'is-active');
		cy.get('@item03').should('not.have.class', 'is-active');

		//Show tab 2
		cy.get('@anchor02').click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');

		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@instance').invoke('getState', 'currentTab').should('eql', [0, 1]);
		cy.get('@item01').should('have.class', 'is-active');
		cy.get('@item02').should('have.class', 'is-active');
		cy.get('@item03').should('not.have.class', 'is-active');

		cy.wait(100);

		//Show tab 3
		cy.get('@anchor03').click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');

		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@instance').invoke('getState', 'currentTab').should('eql', [0, 1, 2]);
		cy.get('@item01').should('have.class', 'is-active');
		cy.get('@item02').should('have.class', 'is-active');
		cy.get('@item03').should('have.class', 'is-active');

		cy.wait(100);

		//Hide tab 1
		cy.get('@anchor01').click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');

		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@instance').invoke('getState', 'currentTab').should('eql', [1, 2]);
		cy.get('@item01').should('not.have.class', 'is-active');
		cy.get('@item02').should('have.class', 'is-active');
		cy.get('@item03').should('have.class', 'is-active');

		cy.wait(100);

		//Hide tab 2
		cy.get('@anchor02').click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');

		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@instance').invoke('getState', 'currentTab').should('eql', [2]);
		cy.get('@item01').should('not.have.class', 'is-active');
		cy.get('@item02').should('not.have.class', 'is-active');
		cy.get('@item03').should('have.class', 'is-active');

		cy.wait(100);

		//Hide tab 3
		cy.get('@anchor03').click();
		cy.get('@instance').invoke('getState', 'animating').should('be.true');

		cy.get('@instance').invoke('getState', 'animating').should('be.false');
		cy.get('@instance').invoke('getState', 'currentTab').should('eql', []);
		cy.get('@item01').should('not.have.class', 'is-active');
		cy.get('@item02').should('not.have.class', 'is-active');
		cy.get('@item03').should('not.have.class', 'is-active');
	});
});
