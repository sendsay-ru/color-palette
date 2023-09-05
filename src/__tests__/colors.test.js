const { toHex, toHexWithoutAlpha, getResult } = require('../color');

describe('toHex', () => {
  it('should expose a function', () => {
    expect(toHex).toBeDefined();
  });

  it.each`
    value                       | result
    ${'#fff'}                   | ${'#fff'}
    ${'#ffffff'}                | ${'#fff'}
    ${'#ffffffff'}              | ${'#fff'}
    ${'#fff3'}                  | ${'#fff3'}
    ${'#2564eb'}                | ${'#2564eb'}
    ${'#2564ebe6'}              | ${'#2564ebe6'}
    ${'rgba(199, 131, 0, 0.8)'} | ${'#c78300cc'}
    ${'rgb(199, 131, 0)'}       | ${'#c78300'}
    ${'#2564eb1a'}              | ${'#2564eb1a'}
  `(
    'should return "$result" if input color is "$value"',
    ({ value, result }) => {
      expect(toHex(value)).toBe(result);
    },
  );
});

describe('toHexWithoutAlpha', () => {
  it('should expose a function', () => {
    expect(toHexWithoutAlpha).toBeDefined();
  });

  it.each`
    value                       | result
    ${'#fff'}                   | ${'#fff'}
    ${'#ffffff'}                | ${'#fff'}
    ${'#ffffffff'}              | ${'#fff'}
    ${'#fff3'}                  | ${'#fff'}
    ${'#2564eb'}                | ${'#2564eb'}
    ${'#2564ebe6'}              | ${'#2564eb'}
    ${'#2564eb1a'}              | ${'#2564eb'}
    ${'rgba(199, 131, 0, 0.8)'} | ${'#c78300'}
    ${'rgb(199, 131, 0)'}       | ${'#c78300'}
  `(
    'should return "$result" if input color is "$value"',
    ({ value, result }) => {
      expect(toHexWithoutAlpha(value)).toBe(result);
    },
  );
});

describe('getResult', () => {
  it('should expose a function', () => {
    expect(toHexWithoutAlpha).toBeDefined();
  });

  it('should return expected value with no replaceable color', () => {
    const info = {
      colors: ['#8dad62'],
      files: ['src/__tests__/__mocks__/dialog.css'],
      hex: '#8dad62',
      matches: 7,
      replaceable: false,
      siblings: [
        {
          delta: 0.098,
          group: 'lime',
          hex: '#65a30d',
          name: '600',
          var: '--color-lime-600',
        },
      ],
    };

    expect(getResult(info)).toEqual({
      value: '#8dad62',
    });
  });

  it('should return expected value with replaceable color', () => {
    const info = {
      colors: ['#eaeaea'],
      files: ['src/__tests__/__mocks__/dialog.css'],
      hex: '#eaeaea',
      matches: 1,
      replaceable: true,
      siblings: [
        {
          delta: 0.011,
          group: 'neutral',
          hex: '#e5e5e5',
          name: '200',
          var: '--color-neutral-200',
        },
      ],
    };

    expect(getResult(info)).toEqual({
      hex: '#e5e5e5',
      value: 'var(--color-neutral-200)',
      var: '--color-neutral-200',
    });
  });

  it('should return expected value with replaceable alpha color', () => {
    const info = {
      alpha: {
        opacity: 0.4,
        withoutAlpha: '#000',
      },
      colors: ['rgba(0, 0, 0, .4)'],
      files: ['src/__tests__/__mocks__/dialog.css'],
      hex: '#0006',
      matches: 1,
      replaceable: true,
      siblings: [
        {
          delta: 0,
          group: 'base',
          hex: '#000',
          name: 'black',
          var: '--ss-color-black',
        },
      ],
    };

    expect(getResult(info)).toEqual({
      hex: '#0006',
      opacity: 0.4,
      order: '--ss-color-black-0.4',
      value: 'var(--ss-color-black-a-40)',
      var: '--ss-color-black-a-40',
    });
  });
});
