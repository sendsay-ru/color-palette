const path = require('path');
const parse = require('../parse');
const render = require('../render');
const { cleanCache } = require('../cache');

describe('Parse and render', () => {
  beforeEach(() => {
    cleanCache();
  });

  it('should expose a functions', () => {
    expect(parse).toBeDefined();
    expect(render).toBeDefined();
  });

  it('should return expected value', async () => {
    const result = await parse({
      files: ['./**/__mocks__/dialog.css'],
      delta: 0.04,
      server: false,
      silent: true,
    });

    expect(result.data).toMatchSnapshot();
  });

  it('should return expected value with custom palette', async () => {
    const result = await parse({
      files: ['./**/__mocks__/*.css'],
      ignore: ['dialog'],
      palette: path.resolve(__dirname, './__mocks__/palette_gray.json'),
      number: 2,
      server: false,
      silent: true,
    });

    expect(result.data).toMatchSnapshot();
  });

  it('should return expected value with custom palette without vars', async () => {
    const result = await parse({
      files: ['./**/__mocks__/*.js'],
      palette: path.resolve(__dirname, './__mocks__/palette_no_vars.json'),
      server: false,
      silent: true,
    });

    cleanCache();

    const resultWithFlag = await parse({
      files: ['./**/__mocks__/*.js'],
      server: false,
      vars: false,
      silent: true,
    });

    expect(result.data).toEqual(resultWithFlag.data);

    expect(result.data).toMatchSnapshot();
  });

  it('should return expected value when colors not found', async () => {
    const result = await parse({
      files: ['./**/__mocks__/empty.css'],
      server: false,
      silent: true,
    });

    expect(result.data).toMatchSnapshot();
  });
});
