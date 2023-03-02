const { green, red, blue, cyan, yellow, gray } = require('kleur');

function displayTitle(){
	console.log(blue(`
  _____       _     _     _ _     ____        _ _     _
 |  __ \\     | |   | |   (_) |   |  _ \\      (_) |   | |
 | |__) |__ _| |__ | |__  _| |_  | |_) |_   _ _| | __| | ___ _ __
 |  _  // _\` | '_ \\| '_ \\| | __| |  _ <| | | | | |/ _\` |/ _ \\ '__|
 | | \\ \\ (_| | |_) | |_) | | |_  | |_) | |_| | | | (_| |  __/ |
 |_|  \\_\\__,_|_.__/|_.__/|_|\\__| |____/ \\__,_|_|_|\\__,_|\\___|_|

 `));
}

function log(message, type = 'INFO'){
	let time = new Date().toLocaleTimeString();

	if(type === 'ERROR'){
		type = red(' ERROR ');
		message = red(message);
	}else if(type === 'WARN'){
		type = yellow(' WARN  ');
		message = yellow(message);
	}else if(type === 'SUCCESS'){
		type = green('SUCCESS');
		message = green(message);
	}else{
		type = cyan(' INFO  ');
		message = cyan(message);
	}

	console.log(`${gray('[')}${time}${gray(']')} ${gray('[')}${type}${gray(']')} ${message}`);
}

module.exports = { displayTitle, log };