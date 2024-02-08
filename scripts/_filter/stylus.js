module.exports = hexo.extend.filter.register('stylus:renderer', function (style) {
  const url_for = hexo.extend.helper.get('url_for').bind(hexo);
  style
    .define('url_for', function (data) {
      return url_for(data.val);
    });
});