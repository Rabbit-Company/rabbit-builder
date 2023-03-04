import fs from 'fs-extra';
import { resolve } from 'path';
import chalk from "chalk";
import { MultiProgressBars } from 'multi-progress-bars';

const supportedActions = ['copy', 'sleep', 'remove'];

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
	if(config.action === 'remove') return await remove(task, action, location, config);
}

async function copy(task, action, location, config){
	if(typeof(config.location) !== 'string') return new Promise((resolve, reject) => { reject("Action 'copy' requires 'location'.")});
	let copyFrom = resolve(location, config.location);

	let excludes = [];
	if(typeof(config.excludes) === 'object' && config.excludes.length !== 0) excludes = config.excludes;

	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.cyan, nameTransformFn: chalk.cyan });
	fs.copySync(copyFrom, resolve(location, 'output'), { overwrite: true, filter: path => (!excludes.includes(path.replace(copyFrom, '')))});
	multiBar.done(task + ' | ' + action, { message: chalk.green('Finished!') });

	return new Promise((resolve, reject) => { resolve() });
}

async function sleep(task, action, config){
	if(typeof(config.time) !== 'number') return new Promise((resolve, reject) => { reject("Action 'sleep' requires 'time' (Value in seconds)") });

	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.yellow, nameTransformFn: chalk.yellow });
	for(let i = 0; i < config.time; i++){
		await new Promise(resolve => setTimeout(resolve, 1000));
		multiBar.incrementTask(task + ' | ' + action, { percentage: 1/config.time });
	}

	multiBar.done(task + ' | ' + action, { message: chalk.green('Finished!') });
	return new Promise((resolve, reject) => { resolve() });
}

async function remove(task, action, location, config){
	if(typeof(config.files) !== 'object' || config.files.length === 0) return new Promise((resolve, reject) => { reject("Action 'remove' requires 'files'.")});

	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.red, nameTransformFn: chalk.red });
	for(let i = 0; i < config.files.length; i++){
		fs.removeSync(resolve(location, 'output', config.files[i]));
		multiBar.incrementTask(task + ' | ' + action, { percentage: i/config.files.length });
	}
	multiBar.done(task + ' | ' + action, { message: chalk.green('Finished!') });
	return new Promise((resolve, reject) => { resolve() });
}