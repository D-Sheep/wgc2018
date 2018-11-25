const env = require('../../_env');

describe('Lets try to open the project url', function () {
	it('Visits Home Page', function () {
		cy.visit(env.PROXY);
	});
});