import { generateColorPalette, rgbHexToRGBA } from './color';

const hexAndRGBs = [
  {
    hex: '#FFFFFF',
    rgb: { r: 255, g: 255, b: 255, a: 1 },
  },
  {
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0, a: 1 },
  },
  // 実データからいくつかピックアップ
  {
    hex: '#D6001C',
    rgb: { r: 214, g: 0, b: 28, a: 1 },
  },
  {
    hex: '#85B974',
    rgb: { r: 133, g: 185, b: 116, a: 1 },
  },
  {
    hex: '#91442A',
    rgb: { r: 145, g: 68, b: 42, a: 1 },
  },
  {
    hex: '#556056',
    rgb: { r: 85, g: 96, b: 86, a: 1 },
  },
  {
    hex: '#044E87',
    rgb: { r: 4, g: 78, b: 135, a: 1 },
  },
];

test('test hexToRGB', () => {
  hexAndRGBs.forEach(({ hex, rgb }) => {
    expect(rgbHexToRGBA(hex)).toEqual(rgb);
  });
});

test('test generateColorPalette', () => {
  expect(generateColorPalette('#AAAA32')).toEqual({
    '50': rgbHexToRGBA('#DCDC64'),
    '100': rgbHexToRGBA('#D2D25A'),
    '200': rgbHexToRGBA('#C8C850'),
    '300': rgbHexToRGBA('#BEBE46'),
    '400': rgbHexToRGBA('#B4B43C'),
    '500': rgbHexToRGBA('#AAAA32'),
    '600': rgbHexToRGBA('#A0A028'),
    '700': rgbHexToRGBA('#96961E'),
    '800': rgbHexToRGBA('#8C8C14'),
    '900': rgbHexToRGBA('#82820A'),
  });
  expect(generateColorPalette('#D6001C')).toEqual({
    '50': rgbHexToRGBA('#FF324E'),
    '100': rgbHexToRGBA('#FE2844'),
    '200': rgbHexToRGBA('#F41E3A'),
    '300': rgbHexToRGBA('#EA1430'),
    '400': rgbHexToRGBA('#E00A26'),
    '500': rgbHexToRGBA('#D6001C'),
    '600': rgbHexToRGBA('#CC0012'),
    '700': rgbHexToRGBA('#C20008'),
    '800': rgbHexToRGBA('#B80000'),
    '900': rgbHexToRGBA('#AE0000'),
  });
  expect(generateColorPalette('#000000')).toEqual({
    '50': rgbHexToRGBA('#323232'),
    '100': rgbHexToRGBA('#282828'),
    '200': rgbHexToRGBA('#1E1E1E'),
    '300': rgbHexToRGBA('#141414'),
    '400': rgbHexToRGBA('#0A0A0A'),
    '500': rgbHexToRGBA('#000000'),
    '600': rgbHexToRGBA('#000000'),
    '700': rgbHexToRGBA('#000000'),
    '800': rgbHexToRGBA('#000000'),
    '900': rgbHexToRGBA('#000000'),
  });
  expect(generateColorPalette('#FFFFFF')).toEqual({
    '50': rgbHexToRGBA('#FFFFFF'),
    '100': rgbHexToRGBA('#FFFFFF'),
    '200': rgbHexToRGBA('#FFFFFF'),
    '300': rgbHexToRGBA('#FFFFFF'),
    '400': rgbHexToRGBA('#FFFFFF'),
    '500': rgbHexToRGBA('#FFFFFF'),
    '600': rgbHexToRGBA('#F5F5F5'),
    '700': rgbHexToRGBA('#EBEBEB'),
    '800': rgbHexToRGBA('#E1E1E1'),
    '900': rgbHexToRGBA('#D7D7D7'),
  });
});
