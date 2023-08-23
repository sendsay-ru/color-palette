const path = require('path');

const MAX_DELTA = 0.034;
const MAKE_REPLACE = false;

const INCLUDE_FILES = ['./**/*.css'];
const EXCLUDE_FILES = ['node_modules', 'build'];

const PROJECT_DIR = path.resolve(__dirname, '../');
const BUILD_DIR = path.resolve(PROJECT_DIR, './build');
const TEMPLATES_DIR = path.resolve(PROJECT_DIR, './templates');

const DEFAULT_CONFIG = {
  delta: MAX_DELTA,
  files: INCLUDE_FILES,
  ignore: EXCLUDE_FILES,
  palette: path.resolve(__dirname, '../config/palette.json'),
  replace: MAKE_REPLACE,
  silent: false,
};

module.exports = {
  PROJECT_DIR,
  BUILD_DIR,
  TEMPLATES_DIR,
  DEFAULT_CONFIG,
};
