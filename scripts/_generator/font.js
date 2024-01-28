const opentype = require('opentype.js');
const path = require('path');
const fs = require('fs');
const { Buffer } = require("node:buffer");
const { getObjValues } = require("../_utils");

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
    unitsPerEm: font.unitsPerEm,
    ascender: font.ascender,
    descender: font.descender,
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
    .concat(config.reward.text)
    .concat(config.foot.title);

  if (config.cv) text = text.concat(getObjValues(config.cv));

  return Array.from(new Set(text.join("").split("")))
    .sort().join("");
  // must be sorted and .notdef at first position. see: https://github.com/opentypejs/opentype.js/issues/94
}