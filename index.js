#!/usr/bin/env node

const { Command } = require('commander');
const createHandler = require('./handlers/createHandler');

const program = new Command();

program
  .name('create-p5js-app')
  .description('Generate a basic p5.js project scaffolding.')
  .version('1.0.0')
  .argument('[destination]', 'Path or name of the project')
  .option('--no-install', 'Skip npm install')
  .action(createHandler); // Delegates to the createHandler function

// Run the CLI
program.parse(process.argv);
