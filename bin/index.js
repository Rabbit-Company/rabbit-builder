#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const { displayTitle, log } = require('./utils.js');

let config = {};

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
}catch(err){
	log("Configuration file 'rabbit-builder.json' is missing or corrupt!", 'ERROR');
	return;
}