#!/usr/bin/env node

const { program } = require('commander');
const { DEFAULT_CONFIG } = require('./constants');
const packageJSON = require('../package.json');
const parse = require('./parse');
const render = require('./render');
const save = require('./save');
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
  .option('--no-vars', 'do not use vars')
  .option('--no-server', 'do not start the server')
  .version(packageJSON.version);

program.parse();

const options = program.opts();

const App = async () => {
  const data = await parse(options);

  const files = render(data, options);

  save(files);

  if (options.server) {
    serve();
  }
};

App(options);
