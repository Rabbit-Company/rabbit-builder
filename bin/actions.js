const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const { resolve } = require('path');
const { ProgressBar } = require('./progress.js');

const supportedActions = ['copy'];

function executeAction(location, config){
	if(typeof(config.action) !== 'string') return 1;
	if(!supportedActions.includes(config.action)) return 2;

	if(config.action === 'copy') return copy(location, config);
}

function copy(location, config){
	if(typeof(config.location) !== 'string') return "Action 'copy' requires 'location'.";
	const bar = new ProgressBar();

	let copyFrom = resolve(location, config.location);

	let excludes = [];
	if(typeof(config.excludes) === 'object' && config.excludes.length !== 0) excludes = config.excludes;

	bar.start(1);
	fs.copySync(copyFrom, resolve(location, 'output'), { filter: path => (!excludes.includes(path.replace(copyFrom, '')))});
	bar.increment();
	bar.stop();

	return 0;
}

module.exports = { executeAction };