#!/usr/bin/env node

const path = require('path');
const packageJSON = require(path.resolve(__dirname, '../package.json'));
const { program } = require('commander');
const { DEFAULT_CONFIG } = require('./constants');
const { parse } = require('./utils');

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
  .option(
    '-r --replace',
    `make replaces in files, default: ${DEFAULT_CONFIG.replace}`,
  )
  .version(packageJSON.version);

program.parse();

const options = { ...DEFAULT_CONFIG, ...program.opts() };

console.log(options);

parse(options);
