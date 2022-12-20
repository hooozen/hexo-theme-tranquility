moment = require("moment");

module.exports = hexo => {
  hexo.locals.set('timelineData', getTimeline);

  function getTimeline() {
    return hexo.locals.get('posts').sort('-date')
      .filter(post => post.type === 'event' || post.type === 'app' || post.selected)
      .map(p => ({
        title: p.title,
        path: p.exurl || p.path,
        type: p.type || 'article',
        date: moment(p.date).format('YYYY-MM-DD'),
      }));
  };
};