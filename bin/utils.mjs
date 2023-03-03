import chalk from "chalk";

export function displayTitle(){
	console.log(chalk.blue(`
  _____       _     _     _ _     ____        _ _     _
 |  __ \\     | |   | |   (_) |   |  _ \\      (_) |   | |
 | |__) |__ _| |__ | |__  _| |_  | |_) |_   _ _| | __| | ___ _ __
 |  _  // _\` | '_ \\| '_ \\| | __| |  _ <| | | | | |/ _\` |/ _ \\ '__|
 | | \\ \\ (_| | |_) | |_) | | |_  | |_) | |_| | | | (_| |  __/ |
 |_|  \\_\\__,_|_.__/|_.__/|_|\\__| |____/ \\__,_|_|_|\\__,_|\\___|_|

 `));
}

export function log(message, type = 'INFO'){
	let time = new Date().toLocaleTimeString();

	if(type === 'ERROR'){
		type = chalk.red(' ERROR ');
		message = chalk.red(message);
	}else if(type === 'WARN'){
		type = chalk.yellow(' WARN  ');
		message = chalk.yellow(message);
	}else if(type === 'SUCCESS'){
		type = chalk.green('SUCCESS');
		message = chalk.green(message);
	}else{
		type = chalk.cyan(' INFO  ');
		message = chalk.cyan(message);
	}

	console.log(`${chalk.gray('[')}${time}${chalk.gray(']')} ${chalk.gray('[')}${type}${chalk.gray(']')} ${message}`);
}