#!/usr/bin/env node

const path = require('path');
const crypto = require("crypto");
const { bold, green, red, blue } = require('kleur');
const { log } = require('./utils.js');

console.log(blue(`
 _____       _     _     _ _     ____        _ _     _           
|  __ \\     | |   | |   (_) |   |  _ \\      (_) |   | |          
| |__) |__ _| |__ | |__  _| |_  | |_) |_   _ _| | __| | ___ _ __ 
|  _  // _\` | '_ \\| '_ \\| | __| |  _ <| | | | | |/ _\` |/ _ \\ '__|
| | \\ \\ (_| | |_) | |_) | | |_  | |_) | |_| | | | (_| |  __/ |   
|_|  \\_\\__,_|_.__/|_.__/|_|\\__| |____/ \\__,_|_|_|\\__,_|\\___|_|   
                                                                                                                                  
`));

if(process.argv.length < 3){
  log("Please provide the path to the project directory.", 'ERROR');
  log("Example 1 (Current directory): rabbit-builder .");
  log("Example 2 (Relative path): rabbit-builder Passky/Passky-Client");
  log("Example 3 (Absolute path): rabbit-builder /home/ziga/Documents/Projects/Passky/Passky-Client");
	return;
}

const dir = path.resolve(process.argv[2]);

console.log(dir);