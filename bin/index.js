#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const { bold } = require('kleur');
const { displayTitle, log } = require('./utils.js');

let config = {};
let tasks = [];
let taskConfig = {};

displayTitle();

if(process.argv.length < 3){
	log("Please provide the path to the project directory.", 'ERROR');
	log("Example 1 (Current directory): rabbit-builder .");
	log("Example 2 (Relative path): rabbit-builder Passky/Passky-Client");
	log("Example 3 (Absolute path): rabbit-builder /home/ziga/Documents/Projects/Passky/Passky-Client");
	return;
}

const dir = path.resolve(process.argv[2]);
log("Project directory: " + dir);

try{
	const data = fs.readFileSync(path.resolve(dir, 'rabbit-builder.json'), 'utf8');
	config = JSON.parse(data);
	log("Configuration file: " + path.resolve(dir, 'rabbit-builder.json'));
}catch(err){
	log("Configuration file 'rabbit-builder.json' is missing or corrupt!", 'ERROR');
	return;
}

let codeLocation = config.code.location || "src";
try{
	fs.readdirSync(path.resolve(dir, codeLocation), 'utf8');
	log("Source code directory: " + path.resolve(dir, codeLocation));
}catch(err){
	log("The projects source code is missing!", 'ERROR');
	return;
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
	return;
}

console.log();

log(bold(tasks.length) + " tasks detected. [" + bold(tasks) + "]");

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

log(bold(validTasks) + " valid tasks and " + bold(invalidTasks) + " invalid tasks. Valid tasks: [" + bold(tasks) + "]");
console.log();

// Start tasks
for(let i = 0; i < Object.keys(taskConfig).length; i++){
	let task = Object.keys(taskConfig)[i];
	log(`Starting task '${bold(task)}'`);

	log(`Task '${bold(task)}' completed.`, 'SUCCESS');
}