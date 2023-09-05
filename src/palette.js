const c = require('ansi-colors');
const fs = require('fs');
const path = require('path');
const schema = require('../config/schema');

const groupPalette = (palette) =>
  palette.reduce((res, { group = '', ...color }) => {
    if (!res[group]) {
      res[group] = [{ ...color }];
    } else {
      res[group].push({ ...color });
    }

    return res;
  }, {});

const getPalette = (config) => {
  const paletteContent = fs.readFileSync(
    path.resolve(process.cwd(), config.palette),
  );
  const paletteJSON = JSON.parse(paletteContent) || [];

  const validation = schema.validate(paletteJSON);

  if (validation.error) {
    throw validation.error;
  }

  if (validation.warning && !config.silent) {
    console.warn(c.yellow(validation.warning.message));
    console.log();
  }

  return paletteJSON;
};

module.exports = {
  groupPalette,
  getPalette,
};
