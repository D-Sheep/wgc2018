const fs = require('fs'),
	vars = require('./vars.js'),
	args = process.argv;

let addSemanticBuildTask = function (sequence) {
	sequence.push('build-semantic');
};

let addTask = function (sequence, task) {
	if (typeof task === 'undefined') {
		return;
	}

	if (Array.isArray(task)) {
		sequence = [...sequence, ...task];
		return;
	}

	sequence.push(task);
};

let addProductionTasks = function (sequence) {
	sequence.push('prod-admin');
};

let checkArguments = function (sequence) {
	if (args.includes('--build-semantic')) {
		if (!sequence.includes('build-semantic')) {
			addSemanticBuildTask(sequence);
		}
	}
};

let getOrCreateRegulatedPackages = (filename) => fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, 'utf8')) : {};

let modifyPackageVersionInRegulatedPackages = (regulatedPackages, filename) => {
	fs.writeFileSync(filename, JSON.stringify(regulatedPackages), 'utf8', function (err) {
		if (err) throw err;
	});
};

let checkForChanges = function (sequence, callback) {
	let promises = [];
	let changes = false;
	let regulatedPackages = getOrCreateRegulatedPackages(vars.REGULATED_PACKAGES_FILENAME);

	for (let regulatedPackageName in vars.REGULATED_PACKAGES) {

		if (!vars.REGULATED_PACKAGES.hasOwnProperty(regulatedPackageName)) {
			continue;
		}

		let packagePromise = new Promise((resolve, reject) => {

			const packageJson = fs.existsSync('package.json') ? JSON.parse(fs.readFileSync('package.json', 'utf8')) : null,
				installedPackageVersion = regulatedPackages !== null && regulatedPackages.hasOwnProperty(regulatedPackageName) ? regulatedPackages[regulatedPackageName] : null,
				requiredPackageVersion = packageJson.dependencies.hasOwnProperty(regulatedPackageName) ? packageJson.dependencies[regulatedPackageName] : null,
				packageBuildTask = vars.REGULATED_PACKAGES[regulatedPackageName];

			if (installedPackageVersion !== requiredPackageVersion) {
				changes = true;
				regulatedPackages[regulatedPackageName] = requiredPackageVersion;
				resolve(packageBuildTask);
			} else {
				resolve();
			}

		}).then((packageBuildTask) => {
			addTask(sequence, packageBuildTask);

			return sequence;
		}).catch((error) => {
			console.log(error);

			return sequence;
		});

		promises.push(packagePromise);

	}

	Promise.all(promises).then(() => {
		checkArguments(sequence);

		if (process.env.NODE_ENV === 'production') {
			addProductionTasks(sequence);
		}

		if (changes) {
			modifyPackageVersionInRegulatedPackages(regulatedPackages, vars.REGULATED_PACKAGES_FILENAME);
		}

		return callback(sequence);
	});
};

module.exports = {
	addSemanticBuildTask,
	addTask,
	checkArguments,
	checkForChanges,
};
