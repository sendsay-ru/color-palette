const { server } = require('superstatic');
const c = require('ansi-colors');
const { BUILD_DIR } = require('./constants');

module.exports.serve = () => {
  const DEFAULT_PORT = process.env.PORT || 4040;

  const app = server({
    port: DEFAULT_PORT,
    cwd: BUILD_DIR,
  });

  app.listen(() => {
    console.log(
      c.green('Listening on'),
      c.blue(`http://localhost:${DEFAULT_PORT}`),
    );
  });
};
