const htmlGenerator = require("./htmlGenerator");
const trqlt_tagcloud = require('./tagcloud.js');

module.exports = function (hexo) {
  hexo.extend.helper.register('htmlGenerator', htmlGenerator);
  hexo.extend.helper.register('trqlt_tagcloud', trqlt_tagcloud);
};