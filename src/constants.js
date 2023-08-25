const path = require('path');

const PROJECT_DIR = path.resolve(__dirname, '../');
const BUILD_DIR = path.resolve(PROJECT_DIR, './build');
const TEMPLATES_DIR = path.resolve(PROJECT_DIR, './templates');

const DEFAULT_CONFIG = {
  delta: 0.034,
  files: ['./**/*.css'],
  ignore: ['node_modules', 'build'],
  palette: path.resolve(__dirname, '../config/palette.json'),
  number: 1,
  replace: false,
  silent: false,
};

module.exports = {
  BUILD_DIR,
  TEMPLATES_DIR,
  DEFAULT_CONFIG,
};
