const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const c = require('ansi-colors');
const { glob } = require('glob');
const { colord, extend } = require('colord');
const minifyPlugin = require('colord/plugins/minify');
const labPlugin = require('colord/plugins/lab');
const { BUILD_DIR, TEMPLATES_DIR, DEFAULT_CONFIG } = require('./constants');
const baseColors = require('../config/base.json');
const schema = require('./schema');

extend([minifyPlugin, labPlugin]);

const COLOR_REGEXP = [/(#[0-9a-z]+)/gi, /(rgba?\([0-9,.\s/%]+\))/gi];
const BASE_COLOR_REGEXP = (name) => new RegExp(`: (${name});?$`, 'igm');

const groupPalette = (palette) =>
  palette.reduce((res, { group = '', ...color }) => {
    if (!res[group]) {
      res[group] = [{ ...color }];
    } else {
      res[group].push({ ...color });
    }

    return res;
  }, {});

const getPalette = (palettePath) => {
  const paletteContent = JSON.parse(fs.readFileSync(palettePath)) || [];

  const validation = schema.validate(paletteContent);

  if (validation.error) {
    throw validation.error;
  }

  if (validation.warning) {
    console.warn(c.yellow(validation.warning.message));
    console.log();
  }

  return paletteContent;
};

const parse = async (options) => {
  const config = { ...DEFAULT_CONFIG, ...options };

  const cache = [];
  const replaces = {};
  let find = 0;
  let filesCount = 0;

  const palettePath = path.resolve(process.cwd(), config.palette);
  const palette = getPalette(palettePath);

  const getStat = () => ({
    palette: Object.entries(palette).length,
    files: filesCount,
    find,
    unique: cache.length,
    replaces: Object.entries(replaces).length,
  });

  const getExistsColor = (color) =>
    cache.find(({ hex }) => colord(color).isEqual(hex));

  const getResult = (item) => (item.var && config.vars ? item.var : item.hex);

  const getColor = ({ color: draftColor, file }) => {
    let color = draftColor;

    if (baseColors[color]) {
      color = baseColors[color];
    }

    if (!colord(color).isValid()) {
      return color;
    }

    const hex = colord(colord(color).toHex()).minify({ alphaHex: true });

    if (colord(hex).alpha() !== 1) {
      return color;
    }

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

      return getResult(existsColor.result);
    }

    const siblings = palette.map(({ code, group, name, ...sibling }) => {
      const delta = colord(hex).delta(sibling.hex);

      const res = {
        name: name || code || '',
        group: group || 'base',
        hex: sibling.hex,
        var: config.vars ? sibling.var : undefined,
        delta,
      };

      if (config.vars && sibling.var) {
        res.var = sibling.var;
      }

      return res;
    });

    const result = {
      hex,
    };

    siblings.sort((a, b) => a.delta - b.delta);

    const bestMatch = siblings[0];

    if (bestMatch && bestMatch.delta <= config.delta) {
      result.hex = bestMatch.hex;

      if (bestMatch.var) {
        result.var = `var(${bestMatch.var})`;
      }
    }

    cache.push({
      hex,
      result,
      matches: 1,
      colors: [color],
      siblings: siblings.slice(0, config.number),
      files: [file],
    });

    return getResult(result);
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

  cache.sort((a, b) => b.siblings[0].delta - a.siblings[0].delta);

  console.log(c.blue('stat:'), c.cyan(JSON.stringify(getStat(), null, 2)));
  console.log();

  return {
    data: cache,
    palette,
    replaces,
    config,
  };
};

const render = ({ data, palette, replaces, config }) => {
  const files = [];

  files.push({
    file: path.resolve(BUILD_DIR, 'data.json'),
    content: JSON.stringify(data, null, 2),
  });

  files.push({
    file: path.resolve(BUILD_DIR, 'replaces.json'),
    content: JSON.stringify(replaces, null, 2),
  });

  ejs.renderFile(
    path.resolve(TEMPLATES_DIR, 'index.ejs'),
    { data, config },
    (err, content) => {
      if (err) {
        throw err;
      }

      files.push({
        file: path.resolve(BUILD_DIR, 'index.html'),
        content,
      });
    },
  );

  ejs.renderFile(
    path.resolve(TEMPLATES_DIR, 'palette.ejs'),
    { palette: groupPalette(palette) },
    (err, content) => {
      if (err) {
        throw err;
      }

      files.push({
        file: path.resolve(BUILD_DIR, 'palette.html'),
        content,
      });
    },
  );

  return files;
};

const save = (files) => {
  if (fs.existsSync(BUILD_DIR)) {
    fs.rmSync(BUILD_DIR, {
      force: true,
      recursive: true,
    });
  }

  fs.mkdirSync(BUILD_DIR);

  files.forEach(({ file, content }) => {
    fs.writeFileSync(file, content);
  });
};

module.exports = {
  parse,
  render,
  save,
};
