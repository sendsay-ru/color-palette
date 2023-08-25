const { server } = require('superstatic');
const { BUILD_DIR } = require('./constants');

module.exports.serve = () => {
  const DEFAULT_PORT = process.env.PORT || 4040;

  console.log(BUILD_DIR);
  console.log();

  const app = server({
    port: DEFAULT_PORT,
    cwd: BUILD_DIR,
  });

  app.listen(() => {
    console.log(`Listening on http://localhost:${DEFAULT_PORT}`);
  });
};
