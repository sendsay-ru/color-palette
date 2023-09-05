const ejs = require('ejs');
const path = require('path');
const { BUILD_DIR, TEMPLATES_DIR, DEFAULT_CONFIG } = require('./constants');
const { getPalette, groupPalette } = require('./palette');

module.exports = ({ alphaColors, data, replaces }, options) => {
  const config = { ...DEFAULT_CONFIG, ...options };
  const palette = getPalette(config.palette);
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

  ejs.renderFile(
    path.resolve(TEMPLATES_DIR, 'variables.ejs'),
    { palette: groupPalette(palette), alphaColors },
    (err, content) => {
      if (err) {
        throw err;
      }

      files.push({
        file: path.resolve(BUILD_DIR, 'variables.css'),
        content,
      });
    },
  );

  return files;
};
