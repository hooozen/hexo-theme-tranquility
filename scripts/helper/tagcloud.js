module.exports = function (tags, themeConfigs) {
  let tagcloudHTML = '';
  const tagConfig = themeConfigs.tagcloud;
  if (!tagConfig.fancy) {
    tagConfig.min_font = 1;
    tagConfig.max_font = 1;
    tagConfig.unit = 'em';
  }

  if (themeConfigs.subpage.enable)
    tagcloudHTML = this.tagcloud(tags, tagConfig);
  else
    tagcloudHTML = list_tags();

  if (tagConfig.fancy)
    return `<canvas width="500" height="500" id="tagCanvas">${tagcloudHTML}<canvas>`;

  return tagcloudHTML;
};