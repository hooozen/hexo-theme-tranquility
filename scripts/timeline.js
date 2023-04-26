moment = require("moment");

module.exports = hexo => {
  hexo.locals.set('timelineData', getTimeline);

  function getTimeline() {
    if (!hexo.theme.config.timeline || !hexo.theme.config.timeline.enable) return {}
    const items = hexo.theme.config.timeline.items
    const types = items.map(item => item.name)
    const order = hexo.theme.config.timeline.order ? 'date' : '-date'
    return {
      types,
      posts: hexo.locals.get('posts').sort(order)
        .filter(post => types.includes(post.timeline))
        .map(p => ({
          title: p.title,
          path: p.exurl || p.path,
          icon: items.find(item => item.name == p.timeline).icon,
          type: p.timeline,
          date: moment(p.date).format('YYYY-MM-DD'),
        }))
    }
  };
};