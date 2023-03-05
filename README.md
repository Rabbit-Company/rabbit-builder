# Rabbit Builder

Rabbit Builder is a tool designed to automate some basic tasks that developers commonly perform when building projects. With Rabbit Builder, you can easily copy files, remove files, replace text in files, and minify HTML, CSS, and JavaScript without requiring any programming experience. Instead, Rabbit Builder relies on configuration files that you can customize to meet your specific project needs.

## Getting Started

To get started with Rabbit Builder, you'll need to have Node.js and NPM (Node Package Manager) installed on your system. Once you have these installed, you can install Rabbit Builder by running the following command:
```bash
npm install -g rabbit-builder
```
This will install Rabbit Builder globally on your system.

## Configuration

To use Rabbit Builder, you'll need to create a configuration file in your project directory called `rabbit-builder.json`. This file should include the path to your source code, the path to your tasks, and any custom variables you want to use in your tasks.

Example for `rabbit-builder.json`:
```json
{
  "code": {
    "location": "src"
  },
  "tasks": {
    "location": "apps"
  },
	"variables": {
		"{version}": "8.1.1",
		"{copyrightYear}": "2023"
	}
}
```

Your tasks should be stored in folders located at the path specified in your `rabbit-builder.json` file. Each task folder should contain a configuration file called `rabbit-task.json`, which defines the specific actions Rabbit Builder should perform for that task. Each action can have its own configuration options.

Example for `rabbit-task.json`:
```json
{
	"copy": {
		"action": "copy",
		"location": "../../src"
	},
	"sleep": {
		"action": "sleep",
		"time": 2
	},
	"remove": {
		"action": "remove",
		"files": ["register.html", "lang"]
	},
	"replace": {
		"action": "replace",
		"replace": [
			{
				"from": "::version::",
				"to": "{version}",
				"match": "**/*.{html,ts,js}"
			},
			{
				"from": "::copyrightYear::",
				"to": "{copyrightYear}",
				"match": "**/*.{html,ts,js}"
			}
		]
	},
	"minifyHTML": {
		"action": "minifyHTML"
	},
	"minifyCSS": {
		"action": "minifyCSS"
	},
	"minifyJS": {
		"action": "minifyJS"
	}
}
```

## Usage

Once you have your configuration files set up, you can use Rabbit Builder to perform your tasks by running the following command in your project directory:

```bash
rabbit-builder
# or
rabbit-builder <task-name>
```

Replace `<task-name>` with the name of the task you want to perform. Rabbit Builder will then read the configuration file for that task and execute the specified actions.

## Available Actions
Rabbit Builder currently supports the following actions:

- **copy**: Copy files from one directory to another
- **sleep**: Pause execution for a specified amount of time
- **remove**: Remove files from a directory
- **replace**: Replace text in a file
- **minifyHTML**: Minify HTML files
- **minifyCSS**: Minify CSS files
- **minifyJS**: Minify JavaScript files

Each action can be configured with its own set of options to customize its behavior.