const htmlGenerator = require("./htmlGenerator");

module.exports = function (hexo) {
  hexo.extend.helper.register('htmlGenerator', htmlGenerator);
};