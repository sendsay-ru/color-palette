const path = require('path');

const MAX_DELTA = 0.034;
const MAKE_REPLACE = false;

const INCLUDE_FILES = ['./**/*.css'];
const EXCLUDE_FILES = ['node_modules', 'build', 'reset.css'];

module.exports.DEFAULT_CONFIG = {
  delta: MAX_DELTA,
  files: INCLUDE_FILES,
  ignore: EXCLUDE_FILES,
  palette: path.resolve(__dirname, '../config/palette.json'),
  replace: MAKE_REPLACE,
  serve: true,
};
