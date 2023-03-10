import fs from 'fs-extra';
import * as path from 'path';
import chalk from "chalk";
import { globSync } from 'glob';
import { MultiProgressBars } from 'multi-progress-bars';
import * as htmlMinifier from 'html-minifier';
import CleanCSS from 'clean-css';
import * as esbuild from 'esbuild';

const supportedActions = ['copy', 'sleep', 'remove', 'replace', 'minifyHTML', 'minifyCSS', 'minifyJS'];

const multiBar = new MultiProgressBars({
	initMessage: '',
	anchor: 'top',
	persist: true,
	border: true,
});

export async function executeAction(task, action, location, output, config, variables){
	if(typeof(config.action) !== 'string') return 1;
	if(!supportedActions.includes(config.action)) return 2;

	if(config.action === 'copy') return await copy(task, action, location, output, config);
	if(config.action === 'sleep') return await sleep(task, action, config);
	if(config.action === 'remove') return await remove(task, action, output, config);
	if(config.action === 'replace') return await replace(task, action, output, config, variables);
	if(config.action === 'minifyHTML') return await minifyHTML(task, action, output);
	if(config.action === 'minifyCSS') return await minifyCSS(task, action, output);
	if(config.action === 'minifyJS') return await minifyJS(task, action, output, config);
}

async function copy(task, action, location, output, config){
	if(typeof(config.location) !== 'string') return new Promise((resolve, reject) => { reject("Action 'copy' requires 'location'.")});
	let copyFrom = path.resolve(location, config.location);

	let excludes = [];
	if(typeof(config.excludes) === 'object' && config.excludes.length !== 0) excludes = config.excludes;

	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.cyan, nameTransformFn: chalk.cyan });
	fs.copySync(copyFrom, output, { overwrite: true, filter: path => (!excludes.includes(path.replace(copyFrom, '')))});
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

async function remove(task, action, output, config){
	if(typeof(config.files) !== 'object' || config.files.length === 0) return new Promise((resolve, reject) => { reject("Action 'remove' requires 'files' array.")});

	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.red, nameTransformFn: chalk.red });
	for(let i = 0; i < config.files.length; i++){
		fs.removeSync(path.resolve(output, config.files[i]));
		multiBar.incrementTask(task + ' | ' + action, { percentage: (i+1)/config.files.length });
	}
	multiBar.done(task + ' | ' + action, { message: chalk.green('Finished!') });
	return new Promise((resolve, reject) => { resolve() });
}

async function replace(task, action, output, config, variables){
	if(typeof(config.replace) !== 'object' || config.replace.length === 0) return new Promise((resolve, reject) => { reject("Action 'replace' requires 'replace' array.")});

	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.green, nameTransformFn: chalk.green });
	for(let i = 0; i < config.replace.length; i++){
		let match = config.replace[i].match || '**';
		let to = config.replace[i].to || '';
		if(Object.keys(variables).includes(to)) to = variables[to];
		let files = globSync(match, { cwd: output, root: output, nodir: true, absolute: true});
		for(let j = 0; j < files.length; j++){
			let data = fs.readFileSync(files[j], 'utf-8');
			data = data.replaceAll(config.replace[i].from, to);
			fs.writeFileSync(files[j], data);
		}
		multiBar.incrementTask(task + ' | ' + action, { percentage: (i+1)/config.replace.length });
	}
	multiBar.done(task + ' | ' + action, { message: chalk.green('Finished!') });
	return new Promise((resolve, reject) => { resolve() });
}

async function minifyHTML(task, action, output){
	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.magenta, nameTransformFn: chalk.magenta });

	let htmlFiles = globSync('**/*.html', { cwd: output, root: output, nodir: true, absolute: true});
	for(let i = 0; i < htmlFiles.length; i++){
		let data = fs.readFileSync(htmlFiles[i], 'utf-8');
		fs.writeFileSync(htmlFiles[i], htmlMinifier.minify(data, { collapseWhitespace: true }));
		multiBar.incrementTask(task + ' | ' + action, { percentage: (i+1)/htmlFiles.length });
	}

	multiBar.done(task + ' | ' + action, { message: chalk.green('Finished!') });
	return new Promise((resolve, reject) => { resolve() });
}

async function minifyCSS(task, action, output){
	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.magenta, nameTransformFn: chalk.magenta });

	let cssFiles = globSync('**/*.css', { cwd: output, root: output, nodir: true, absolute: true});
	for(let i = 0; i < cssFiles.length; i++){
		let data = fs.readFileSync(cssFiles[i], 'utf-8');
		fs.writeFileSync(cssFiles[i], new CleanCSS({}).minify(data).styles);
		multiBar.incrementTask(task + ' | ' + action, { percentage: (i+1)/cssFiles.length });
	}

	multiBar.done(task + ' | ' + action, { message: chalk.green('Finished!') });
	return new Promise((resolve, reject) => { resolve() });
}

async function minifyJS(task, action, output, config){
	multiBar.addTask(task + ' | ' + action, { type: 'percentage', barTransformFn: chalk.magenta, nameTransformFn: chalk.magenta });

	let jsFiles = globSync('**/*.{js,mjs}', { cwd: output, root: output, nodir: true, absolute: true});
	let entryPoints = [];
	for(let i = 0; i < jsFiles.length; i++){
		entryPoints.push({in: jsFiles[i], out: jsFiles[i].replace('.js', '').replace('.mjs', '')});
	}
	let options = { entryPoints: entryPoints, write: true, outdir: output, allowOverwrite: true, minify: true, bundle: false, platform: 'browser' };
	if(typeof(config.bundle) === 'object') options['bundle'] = true;
	if(typeof(config.bundle?.platform) === 'string' && ['browser', 'node', 'neutral'].includes(config.bundle?.platform)) options['platform'] = config.bundle.platform;
	if(typeof(config.bundle?.format) === 'string' && ['iife', 'cjs', 'esm'].includes(config.bundle?.format)) options['format'] = config.bundle.format;
	if(typeof(config.bundle?.minify) === 'boolean') options['minify'] = config.bundle.minify;
	if(typeof(config.sourceMap) === 'string' && ['linked', 'inline', 'external', 'both'].includes(config.sourceMap)) options['sourcemap'] = config.sourceMap;

	await esbuild.build(options);

	multiBar.done(task + ' | ' + action, { message: chalk.green('Finished!') });
	return new Promise((resolve, reject) => { resolve() });
}