#!/usr/bin/env node

const { program } = require('commander');
const { DEFAULT_CONFIG } = require('./constants');
const packageJSON = require('../package.json');
const { parse, render, save } = require('./utils');
const { serve } = require('./serve');

program
  .name(packageJSON.name)
  .description(packageJSON.description)
  .option('-f --files [files...]', `path to files`)
  .option('-p --palette <string>', `path to custom palette config`)
  .option('-i --ignore [files...]', `ignore files`)
  .option(
    '-d --delta <number>',
    `max delta when comparing files, min:0, max:1, default: ${DEFAULT_CONFIG.delta}`,
  )
  .option('-n --number <number>', 'number of relevant colors')
  .option('-r --replace', `make replaces in files`)
  .option('-s --silent', 'do not start the server')
  .version(packageJSON.version);

program.parse();

const options = program.opts();

const App = async () => {
  const result = await parse(options);

  const files = render(result);

  save(files);

  if (!options.silent) {
    serve();
  }
};

App(options);
