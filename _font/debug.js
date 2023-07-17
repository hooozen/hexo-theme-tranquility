const opentype = require('opentype.js');
const fs = require('node:fs');
const path = require('node:path');

const notdefGlyph = new opentype.Glyph({
  name: '.notdef',
  advanceWidth: 650,
  path: new opentype.Path()
});

let data = fs.readFileSync(path.resolve(__dirname, 'regular.ttf'));
data = new Uint8Array(data).buffer;
const font = opentype.parse(data);

const testText = '暖暖远人村，依依墟里烟。狗吠深巷中，鸡鸣桑树颠。';
const glyphs = [notdefGlyph].concat(font.stringToGlyphs(sortText(testText)));

const sub_font = new opentype.Font({
  unitsPerEm: font.unitsPerEm,
  ascender: font.ascender,
  descender: font.descender,
  familyName: 'temp',
  styleName: 'regular',
  glyphs,
});

const res = sub_font.toArrayBuffer();
fs.writeFileSync(path.resolve(__dirname, 'res.otf'), Buffer.from(res));
// sub_font.download(path.resolve(__dirname, 'res.ttf'));

function sortText(text) {
  return Array.from(new Set(text.split('').sort())).join('');
}