const path = require('path');
const { parse, render } = require('../utils');

describe('Parse and render', () => {
  it('should expose a functions', () => {
    expect(parse).toBeDefined();
    expect(render).toBeDefined();
  });

  it('should return expected value', async () => {
    const result = await parse({
      files: ['./**/__mocks__/dialog.css'],
      delta: 0.04,
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
      silent: true,
    });

    expect(result.data).toMatchSnapshot();
  });

  it('should return expected value with custom palette without vars', async () => {
    const result = await parse({
      files: ['./**/__mocks__/*.js'],
      palette: path.resolve(__dirname, './__mocks__/palette_no_vars.json'),
      silent: true,
    });

    expect(result.data).toMatchSnapshot();
  });

  it('should return expected value when colors not found', async () => {
    const result = await parse({
      files: ['./**/__mocks__/empty.css'],
      silent: true,
    });

    expect(result.data).toMatchSnapshot();
  });
});
