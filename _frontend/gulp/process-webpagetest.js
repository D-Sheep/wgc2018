const vars = require('./vars');
const gulp = require('gulp');
const notifier = require('node-notifier');
const axios = require('axios');
const qs = require('qs');
const _ = require('lodash');
const dotenv = require('dotenv');

const runWebPageTest = (env, callback) => {
	const dotenvVars = dotenv.config({path: `../backend/.env-${env}`}).parsed;
	const locationsUrl = `https://www.webpagetest.org/getLocations.php?f=json&k=${vars.webPageTestAPIKey}`;
	const testUrl = 'http://www.webpagetest.org/runtest.php';

	const runTest = (url) => {
		axios
			.get(locationsUrl) //Fetch a list of available test machine locations
			.then(({data: {data: locations}}) => {

				//Filter out locations that use mobile devices and are always busy
				const suitableLocations = _.reject(locations, (loc) => loc.location.includes('Dulles'));
				//Which machines are least busy?
				const minRunningTestCount = _.reduce(suitableLocations, (acc, loc) => Math.min(acc, loc.PendingTests.Testing), Infinity);
				const freeLocations = _.filter(suitableLocations, (loc) => loc.PendingTests.Testing === minRunningTestCount);
				//Pick a random machine from the free ones
				const randomLocation = _.sample(freeLocations);

				const testOptions = {
					url,
					location: `${randomLocation.location}.3G`, //Test on a random free machine to finish ASAP and simulate 3G connection
					f: 'json', //Response format: JSON
					k: vars.webPageTestAPIKey, //API key
					fvonly: 1, //First view only
					runs: 1, //Only do one test run,
					video: 1, //Generate filmstrip,
					iq: 100 //100% quality filmstrip snapshots
				};

				return axios.post(testUrl, qs.stringify(testOptions)); //Run the automated test
				//API is limited to 200 tests per key per day

			})
			.then(({data: {data}}) => { //Test run info received
				console.log(`Test results will be available at ${data.userUrl}`);
				notifier.notify({
					title: 'WebPageTest',
					message: `Test results will be available at ${data.userUrl}`
				});
				callback();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	//======================================================

	if (dotenvVars.WEB_SITE_LOCK_ENABLED) { //The test will need to bypass WebSiteLock
		const tokenUrl = `${dotenvVars.APP_URL}/web-site-lock/token?password=${dotenvVars.WEB_SITE_LOCK_PASSWORD}`;

		axios
			.get(tokenUrl) //Acquire WebSiteLock access token
			.then(({token}) => {
				if (!token) {
					console.log('Token is unexpectedly missing :( ', token);
					return;
				}

				//Append access token to base url and run the test
				//TODO what if the base url already contains a query string?
				runTest(`${dotenvVars.APP_URL}?websitelocktoken=${token}`);
			})
			.catch((error) => {
				console.log('Failed to acquire WebSiteLock token.', error);
			});
	} else {
		runTest(dotenvVars.APP_URL); //No need to acquire access token, run the test immediately
	}
};

gulp.task('webpagetest-prod', (callback) => runWebPageTest('prod', callback));
gulp.task('webpagetest-preprod', (callback) => runWebPageTest('preprod', callback));
gulp.task('webpagetest-test', (callback) => runWebPageTest('test', callback));
