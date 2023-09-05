const fs = require('fs');
const { BUILD_DIR } = require('./constants');

module.exports = (files) => {
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
