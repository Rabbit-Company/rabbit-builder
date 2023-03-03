//const fs = require('fs-extra');
import * as fs from 'fs';
import { resolve } from 'path';
import chalk from "chalk";
import { MultiProgressBars } from 'multi-progress-bars';

const supportedActions = ['copy', 'sleep'];

const multiBar = new MultiProgressBars({
	initMessage: '',
	anchor: 'top',
	persist: true,
	border: true,
});

export async function executeAction(task, action, location, config){
	if(typeof(config.action) !== 'string') return 1;
	if(!supportedActions.includes(config.action)) return 2;

	if(config.action === 'copy') return await copy(task, action, location, config);
	if(config.action === 'sleep') return await sleep(task, action, config);
}

async function copy(task, action, location, config){
	if(typeof(config.location) !== 'string') return new Promise((resolve, reject) => { reject("Action 'copy' requires 'location'.")});
	let copyFrom = resolve(location, config.location);

	let excludes = [];
	if(typeof(config.excludes) === 'object' && config.excludes.length !== 0) excludes = config.excludes;

	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.cyan, nameTransformFn: chalk.cyan });
	//fs.copySync(copyFrom, resolve(location, 'output'), { filter: path => (!excludes.includes(path.replace(copyFrom, '')))});
	multiBar.incrementTask(task + ' | ' + action, { percentage: 0.2 });

	return new Promise((resolve, reject) => { resolve() });
}

async function sleep(task, action, config){
	if(typeof(config.time) !== 'number') return new Promise((resolve, reject) => { reject("Action 'sleep' requires 'time' (Value in seconds)") });

	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.red, nameTransformFn: chalk.red });
	for(let i = 0; i < config.time; i++){
		await new Promise(resolve => setTimeout(resolve, 1000));
		multiBar.incrementTask(task + ' | ' + action, { percentage: 1/config.time });
	}

	multiBar.done(task + ' | ' + action, { message: 'Finished!' });
	return new Promise((resolve, reject) => { resolve() });
}