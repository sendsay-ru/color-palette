const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { glob } = require('glob');
const { colord, extend } = require('colord');
const minifyPlugin = require('colord/plugins/minify');
const labPlugin = require('colord/plugins/lab');
const { serve } = require('./serve');

extend([minifyPlugin, labPlugin]);

const PROJECT_DIR = path.resolve(__dirname, '../');
const BUILD_DIR = path.resolve(PROJECT_DIR, './build');
const TEMPLATES_DIR = path.resolve(PROJECT_DIR, './templates');

const COLOR_REGEXP = [/#[0-9a-z]+/gi, /rgba?\([0-9,.\s/%]+\)/gi];

const cache = [];
const replaces = {};
let colors = 0;

const groupPalette = (palette) => {
  const res = [];

  palette.forEach(({ group, ...data }) => {
    if (!res[group]) {
      res[group] = [{ ...data }];
    } else {
      res[group].push({ ...data });
    }
  });

  return res;
};

const getExistsColor = (color) =>
  cache.find(({ hex }) => colord(color).isEqual(hex));

const getColor = ({ color, file, palette, delta }) => {
  if (!colord(color).isValid()) {
    return color;
  }

  const hex = colord(colord(color).toHex()).minify({ alphaHex: true });

  if (colord(hex).alpha() !== 1) {
    return color;
  }

  colors++;

  const existsColor = getExistsColor(color);

  if (existsColor) {
    if (!existsColor.files.includes(file)) {
      existsColor.files.push(file);
    }

    if (!existsColor.colors.includes(color)) {
      existsColor.colors.push(color);
    }

    existsColor.matches++;

    return existsColor.result.var;
  }

  const siblings = palette.map((color) => {
    const delta = colord(hex).delta(color.hex);

    return {
      ...color,
      delta,
    };
  });

  siblings.sort((a, b) => a.delta - b.delta);

  const result =
    siblings[0].delta <= delta
      ? {
          var: `var(${siblings[0].var})`,
          hex: siblings[0].hex,
        }
      : {
          var: hex,
          hex,
        };

  cache.push({
    hex,
    result,
    matches: 1,
    colors: [color],
    siblings: siblings.slice(0, 3),
    files: [file],
  });

  return result.var;
};

const replaceColor =
  ({ file, palette, delta }) =>
  (color) => {
    const newColor = getColor({ color, file, palette, delta });

    if (color !== newColor && !replaces[color]) {
      replaces[color] = newColor;
    }

    return newColor;
  };

module.exports.parse = (config) => {
  const palette = require(path.resolve(process.cwd(), config.palette));

  if (!fs.existsSync(BUILD_DIR)) {
    fs.mkdirSync(BUILD_DIR);
  }

  glob(config.files).then((cssFiles) => {
    cssFiles.forEach((file) => {
      if (config.ignore.some((ignorePath) => file.includes(ignorePath))) {
        return;
      }

      const fileContent = fs.readFileSync(file).toString();

      let newFileContent = fileContent;

      COLOR_REGEXP.forEach((regExp) => {
        newFileContent = newFileContent.replace(
          regExp,
          replaceColor({ file, palette, delta: config.delta }),
        );
      });

      if (config.replace && newFileContent !== fileContent) {
        fs.writeFileSync(file, newFileContent);
      }
    });

    cache.sort((a, b) => b.siblings[0].delta - a.siblings[0].delta);

    fs.writeFileSync(
      path.resolve(BUILD_DIR, 'data.json'),
      JSON.stringify(cache, null, 2),
    );

    fs.writeFileSync(
      path.resolve(BUILD_DIR, 'replaces.json'),
      JSON.stringify(replaces, null, 2),
    );

    ejs.renderFile(
      path.resolve(TEMPLATES_DIR, 'index.ejs'),
      { data: cache },
      function (err, content) {
        if (err) {
          throw err;
        }

        fs.writeFileSync(path.resolve(BUILD_DIR, 'index.html'), content);
      },
    );

    ejs.renderFile(
      path.resolve(TEMPLATES_DIR, 'palette.ejs'),
      { palette: groupPalette(palette) },
      function (err, content) {
        if (err) {
          throw err;
        }

        fs.writeFileSync(path.resolve(BUILD_DIR, 'palette.html'), content);
      },
    );

    console.log();
    console.log('>>> palette:', Object.entries(palette).length);

    const replacesCount = Object.entries(replaces).length;

    console.log('>>> find:', colors);
    console.log('>>> unique:', cache.length);
    console.log('>>> replaces:', replacesCount);
    console.log();

    if (config.serve) {
      serve();
    }
  });
};
