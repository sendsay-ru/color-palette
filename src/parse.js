const c = require('ansi-colors');
const fs = require('fs');
const { glob } = require('glob');
const { DEFAULT_CONFIG } = require('./constants');
const baseColors = require('../config/base.json');
const { getPalette } = require('./palette');
const { getColor } = require('./color');
const { cache } = require('./cache');

const COLOR_REGEXP = [/(#[0-9a-z]+)/gi, /(rgba?\([0-9,.\s/%]+\))/gi];
const BASE_COLOR_REGEXP = (name) => new RegExp(`: (${name});?$`, 'igm');

module.exports = async (options) => {
  const config = { ...DEFAULT_CONFIG, ...options };

  const replaces = {};
  const alphaColors = [];
  let find = 0;
  let filesCount = 0;

  const palette = getPalette(config);

  const getStat = () => ({
    palette: Object.entries(palette).length,
    files: filesCount,
    find,
    unique: cache.length,
    replaces: Object.entries(replaces).length,
  });

  const replaceColor = (file) => (match, color) => {
    const result = getColor(color, {
      file,
      palette,
      config,
    });

    if (!result) {
      return color;
    }

    const newColor = result.value;

    if (!result.cached && result.opacity && result.var) {
      alphaColors.push(result);
    }

    if (color !== newColor) {
      find++;

      replaces[color] = newColor;
    }

    if (match !== color) {
      return match.replace(color, newColor);
    }

    return newColor;
  };

  const cssFiles = await glob(config.files);

  cssFiles.forEach((file) => {
    if (config.ignore.some((ignorePath) => file.includes(ignorePath))) {
      return;
    }

    filesCount++;

    const fileContent = fs.readFileSync(file).toString();

    let newFileContent = fileContent;

    COLOR_REGEXP.forEach((regExp) => {
      newFileContent = newFileContent.replace(regExp, replaceColor(file));
    });

    Object.entries(baseColors).forEach(([name]) => {
      newFileContent = newFileContent.replace(
        BASE_COLOR_REGEXP(name),
        replaceColor(file),
      );
    });

    if (config.replace && newFileContent !== fileContent) {
      fs.writeFileSync(file, newFileContent);
    }
  });

  alphaColors.sort((a, b) => String(a.order).localeCompare(b.order));
  cache.sort((a, b) => b.siblings[0].delta - a.siblings[0].delta);

  if (!config.silent) {
    console.log(c.blue('stat:'), c.cyan(JSON.stringify(getStat(), null, 2)));
    console.log();      
  }

  return {
    alphaColors,
    data: cache,
    replaces,
  };
};
