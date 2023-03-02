const { green, red, cyan, yellow, gray } = require('kleur');

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

module.exports = { log };