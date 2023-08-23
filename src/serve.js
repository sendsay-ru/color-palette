const { BUILD_DIR } = require('./constants');

const superstatic = require('superstatic').server;

module.exports.serve = () => {
  console.log('Use a static server in production instead...');
  console.log();

  const DEFAULT_PORT = process.env.PORT || 4040;

  console.log(BUILD_DIR);

  const app = superstatic({
    port: DEFAULT_PORT,

    public: BUILD_DIR,

    rewrites: [{ source: '/**', destination: '/index.html' }],
  });

  app.listen(() => {
    console.log(`Listening on http://localhost:${DEFAULT_PORT}`);
  });
};
