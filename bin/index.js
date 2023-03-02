#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const { displayTitle, log } = require('./utils.js');

let config = {};
let tasksAmount = 0;

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
	tasksAmount = data.length;
	log("Tasks directory: " + path.resolve(dir, tasksLocation));
}catch(err){
	log("The tasks directory is missing!", 'ERROR');
	return;
}