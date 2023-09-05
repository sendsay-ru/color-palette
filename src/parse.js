const c = require('ansi-colors');
const fs = require('fs');
const { glob } = require('glob');
const { colord, extend } = require('colord');
const minifyPlugin = require('colord/plugins/minify');
const labPlugin = require('colord/plugins/lab');
const { DEFAULT_CONFIG } = require('./constants');
const baseColors = require('../config/base.json');
const { getPalette } = require('./palette');

extend([minifyPlugin, labPlugin]);

const COLOR_REGEXP = [/(#[0-9a-z]+)/gi, /(rgba?\([0-9,.\s/%]+\))/gi];
const BASE_COLOR_REGEXP = (name) => new RegExp(`: (${name});?$`, 'igm');

module.exports = async (options) => {
  const config = { ...DEFAULT_CONFIG, ...options };

  const cache = [];
  const replaces = {};
  const alphaColors = [];
  let find = 0;
  let filesCount = 0;

  const palette = getPalette(config.palette);

  const getStat = () => ({
    palette: Object.entries(palette).length,
    files: filesCount,
    find,
    unique: cache.length,
    replaces: Object.entries(replaces).length,
  });

  const getExistsColor = (color) =>
    cache.find(({ hex }) => colord(color).isEqual(hex));

  const getResult = (info) => {
    if (!info.replaceable) {
      return {
        value: info.hex,
      };
    }

    const sibling = info.siblings[0];

    if (!config.vars || !sibling.var) {
      return {
        value: sibling.hex,
      };
    }

    if (!info.alpha) {
      return {
        hex: sibling.hex,
        value: `var(${sibling.var})`,
        var: sibling.var,
      };
    }

    return {
      hex: sibling.hex,
      value: `var(${sibling.var}-a-${info.alpha.opacity * 100})`,
      var: `${sibling.var}-a-${info.alpha.opacity * 100}`,
      order: `${sibling.var}-${info.alpha.opacity}`,
    };
  };

  const getColor = ({ color: draftColor, file }) => {
    let color = draftColor;

    if (baseColors[color]) {
      color = baseColors[color];
    }

    if (!colord(color).isValid()) {
      return color;
    }

    const hex = colord(colord(color).toHex()).minify({ alphaHex: true });

    const alpha = colord(hex).alpha();
    const isAlpha = alpha !== 1;
    const hexWithoutAlpha = colord(hex).alpha(1).toHex();

    find++;

    const existsColor = getExistsColor(hex);

    if (existsColor) {
      if (!existsColor.files.includes(file)) {
        existsColor.files.push(file);
      }

      if (!existsColor.colors.includes(color)) {
        existsColor.colors.push(color);
      }

      existsColor.matches++;

      return existsColor.result.value;
    }

    const siblings = palette.map(({ code, group, name, ...sibling }) => {
      const delta = colord(hexWithoutAlpha).delta(sibling.hex);

      const result = {
        name: name || code || '',
        group: group || 'base',
        hex: sibling.hex,
        delta,
      };

      if (config.vars && sibling.var) {
        result.var = sibling.var;
      }

      return result;
    });

    siblings.sort((a, b) => a.delta - b.delta);

    const replaceable = siblings[0]?.delta <= config.delta;

    const info = {
      hex,
      replaceable,
      matches: 1,
      colors: [color],
      siblings: siblings.slice(0, config.number),
      files: [file],
    };

    if (isAlpha) {
      info.alpha = {
        opacity: alpha,
        withoutAlpha: hexWithoutAlpha,
      };
    }

    const result = getResult(info);

    info.result = result;

    cache.push(info);

    if (isAlpha && replaceable && result.var) {
      alphaColors.push(result);
    }

    return result.value;
  };

  const replaceColor =
    ({ file }) =>
    (match, color) => {
      const newColor = getColor({ color, file });

      if (color !== newColor && !replaces[color]) {
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
      newFileContent = newFileContent.replace(regExp, replaceColor({ file }));
    });

    Object.entries(baseColors).forEach(([name]) => {
      newFileContent = newFileContent.replace(
        BASE_COLOR_REGEXP(name),
        replaceColor({ file }),
      );
    });

    if (config.replace && newFileContent !== fileContent) {
      fs.writeFileSync(file, newFileContent);
    }
  });

  alphaColors.sort((a, b) => String(a.order).localeCompare(b.order));
  cache.sort((a, b) => b.siblings[0].delta - a.siblings[0].delta);

  console.log(c.blue('stat:'), c.cyan(JSON.stringify(getStat(), null, 2)));
  console.log();

  return {
    alphaColors,
    data: cache,
    replaces,
  };
};
