#!/usr/bin/env node

import fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';
import chalk from "chalk";
import { displayTitle, log } from './utils.mjs';
import { executeAction } from './actions.mjs';

let config = {};
let tasks = [];
let taskConfig = {};

displayTitle();

if(process.argv.length < 3){
	log("Please provide the path to the project directory.", 'ERROR');
	log("Example 1 (Current directory): rabbit-builder .");
	log("Example 2 (Relative path): rabbit-builder Passky/Passky-Client");
	log("Example 3 (Absolute path): rabbit-builder /home/ziga/Documents/Projects/Passky/Passky-Client");
	process.exit();
}

const dir = path.resolve(process.argv[2]);
log("Project directory: " + dir);

try{
	const data = fs.readFileSync(path.resolve(dir, 'rabbit-builder.json'), 'utf8');
	config = JSON.parse(data);
	log("Configuration file: " + path.resolve(dir, 'rabbit-builder.json'));
}catch(err){
	log("Configuration file 'rabbit-builder.json' is missing or corrupt!", 'ERROR');
	process.exit();
}

let codeLocation = config.code.location || "src";
try{
	fs.readdirSync(path.resolve(dir, codeLocation), 'utf8');
	log("Source code directory: " + path.resolve(dir, codeLocation));
}catch(err){
	log("The projects source code is missing!", 'ERROR');
	process.exit();
}

let tasksLocation = config.tasks.location || "apps";
try{
	const data = fs.readdirSync(path.resolve(dir, tasksLocation), 'utf8');
	for(let i = 0; i < data.length; i++){
		try{
			if(fs.lstatSync(path.resolve(dir, tasksLocation, data[i])).isDirectory()) tasks.push(data[i]);
		}catch{};
	}
	log("Tasks directory: " + path.resolve(dir, tasksLocation));
}catch(err){
	log("The tasks directory is missing!", 'ERROR');
	process.exit();
}

log(chalk.bold(tasks.length) + " tasks detected. [" + chalk.bold(tasks) + "]");

// Validate tasks
let validTasks = 0;
let invalidTasks = 0;
let vtasks = [];
for(let i = 0; i < tasks.length; i++){
	try{
		const data = fs.readFileSync(path.resolve(dir, tasksLocation, tasks[i], 'rabbit-task.json'), 'utf8');
		taskConfig[tasks[i]] = JSON.parse(data);
		vtasks.push(tasks[i]);
		validTasks++;
	}catch{
		invalidTasks++;
	}
}
tasks = vtasks;

log(chalk.bold(validTasks) + " valid tasks and " + chalk.bold(invalidTasks) + " invalid tasks. Valid tasks: [" + chalk.bold(tasks) + "]");

async function runActions(task, actions){
	for(let j = 0; j < Object.keys(actions).length; j++){
		let action = Object.keys(actions)[j];
		await executeAction(task, action, path.resolve(dir, tasksLocation, task), actions[action]).then().catch(message => {
			log(`[${task}][${action}] ` + message, 'ERROR');
		});
	}
}

// Start tasks
for(let i = 0; i < Object.keys(taskConfig).length; i++){
	let task = Object.keys(taskConfig)[i];
	let actions = taskConfig[task];
	log(`Starting task '${chalk.bold(task)}'`);
	fs.removeSync(path.resolve(dir, tasksLocation, task, 'output'));
	runActions(task, actions).then(() => {
		log(`Task '${chalk.bold(task)}' completed.`, 'SUCCESS');
	});
}