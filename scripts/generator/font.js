const opentype = require('opentype.js');
const path = require('path');
const fs = require('fs');
const { Buffer } = require("node:buffer");

const notdefGlyph = new opentype.Glyph({
  name: '.notdef',
  advanceWidth: 650,
  path: new opentype.Path()
});

module.exports = function (hexo) {
  hexo.extend.generator.register(`subfont`, locals => {
    let { enable, fontName, type, style } = hexo.theme.config.zh_font;

    if (!enable) return;

    const sourceFolder = path.resolve(__dirname, "../../_font/");
    const outPath = '/font';

    const text = getSubText(hexo);
    console.log("Extract subfont: ", text);

    return style.map(subfont => {
      const source = path.resolve(sourceFolder, `${subfont}.${type}`);
      return {
        path: path.join(outPath, `${subfont}.${type}`),
        data: compress(text, { source, name: fontName, style: subfont })
      };
    });
  });
};


function compress(text, params) {
  const { source, name, style } = params;
  let data = fs.readFileSync(source);
  data = new Uint8Array(data).buffer;
  const font = opentype.parse(data);
  glyphs = [notdefGlyph].concat(font.stringToGlyphs(text));

  const sub_font = new opentype.Font({
    ...font,
    familyName: name,
    styleName: style,
    glyphs: glyphs
  });
  const res = sub_font.toArrayBuffer();
  return Buffer.from(res);
}

function getSubText(hexo) {
  const config = hexo.theme.config;
  let text = [config.slogan, config.index.about.title]
    .concat(config.subpage.pages.map(p => p.description))
    .concat(hexo.locals.get('tags').map(tag => tag.name))
    .concat(config.index.about.text)
    .concat(config.index.poem)
    .concat(config.foot.title)
    .join("").split("").concat([" "]);
  text = handleAscii(Array.from(new Set(text)));

  // .filter(rune => /[\u4e00-\u9fa5]/.test(rune))
  // must be sorted and .notdef at first position. see: https://github.com/opentypejs/opentype.js/issues/94
  return text.sort().join("");
}

function handleAscii(text) {
  const ascii = text.filter(w => 0x21 <= w.charCodeAt() && w.charCodeAt() <= 0x7E);
  const capital = ascii.filter(w => 0x41 <= w.charCodeAt() && w.charCodeAt() <= 0x5A);
  const lowcase = ascii.filter(w => 0x61 <= w.charCodeAt() && w.charCodeAt() <= 0x7A);
  const res = text
    .concat(ascii.map(w => String.fromCharCode(w.charCodeAt() + 0xFEE0)))
    .concat(capital.map(w => String.fromCharCode(w.charCodeAt() + 0x20)))
    .concat(lowcase.map(w => String.fromCharCode(w.charCodeAt() - 0x20)));
  return Array.from(new Set(res));
}
