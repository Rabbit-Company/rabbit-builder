const cliProgress = require('cli-progress');
const { bold, cyan, gray } = require('kleur');

class ProgressBar {
	constructor(){
		this.bar = new cliProgress.SingleBar({
			format: `${gray('[')}${new Date().toLocaleTimeString()}${gray(']')} ${gray('[')}${cyan(' INFO  ')}${gray(']')}     ${cyan('{bar}')} ${bold(cyan('{percentage}%'))}`,
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591',
			hideCursor: true
		});
	}

	start(total = 100, startValue = 0){
		this.bar.start(total, startValue);
	}

	increment(step = 1){
		this.bar.increment(step);
	}

	stop(){
		this.bar.stop();
	}
}

module.exports = { ProgressBar };