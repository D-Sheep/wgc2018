const vars = require('./vars');
const gulp = require('gulp');
const axios = require('axios');
const notifier = require('node-notifier');
const qs = require('qs');
const _ = require('lodash');
const dotenv = require('dotenv');

gulp.task('fb-scrape', (callback) => {
	const dotenvVars = dotenv.config({path: '../backend/.env-prod'}).parsed;

	const scrapeUrl = 'https://graph.facebook.com/';
	const scrapeOptions = {
		id: dotenvVars.APP_URL,
		scrape: true,
		access_token: vars.facebookAccessToken
	};

	axios
		.post(scrapeUrl, qs.stringify(scrapeOptions))
		.then((response) => {
			console.log(`${dotenvVars.APP_URL} scraped successfully.`);
			notifier.notify({
				title: 'FB Scrape successful',
				message: `${dotenvVars.APP_URL} scraped successfully.`
			});
			callback();
		})
		.catch((error) => {
			console.log(error.response);
		});
});
