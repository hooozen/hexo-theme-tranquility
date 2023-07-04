/* global ctx */

'use strict';

const pagination = require('hexo-pagination');



module.exports = ctx => {
  ctx.config.subpage_generator = Object.assign({
    per_page: typeof ctx.config.per_page === 'undefined' ? 10 : ctx.config.per_page
  }, ctx.config.subpage_generator);

  ctx.extend.generator.register('subpage', subpage_generator);
  ctx.extend.generator.register('blog', blog);
  // ctx.call("generate");
};

function blog(locals) {
  const config = this.config;
  const posts = locals.posts.sort(config.index_generator.order_by);

  posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0));

  const paginationDir = config.pagination_dir || 'page';

  return pagination('blog', posts, {
    perPage: config.index_generator.per_page,
    layout: ['category'],
    format: paginationDir + '/%d/',
    data: {
      name: '博客',
      icon: 'blog'
    }
  });
};


function subpage_generator(locals) {
  const ctx = this;

  if (!ctx.theme.config.subpage.enable) { return; }

  const config = ctx.config;
  const perPage = config.subpage_generator.per_page;
  const paginationDir = config.pagination_dir || 'page';
  const orderBy = config.subpage_generator.order_by || '-date';

  return ctx.theme.config.subpage.pages.reduce((result, page) => {
    const category = locals.categories.findOne({ name: page.name });
    let path = page.path || page.name;
    path = path.endsWith('/') ? path : path + '/';
    if (!category || !category.length) {
      console.warn(`Warn: There is no post in subpage '${page.title}'`);
      return result.concat([{
        path,
        layout: ['category', 'archive', 'index'],
        data: {
          ...page,
        }
      }]);
    }

    const posts = category.posts.sort(orderBy);
    posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0));
    const ids = getTagIds(category);

    const Tag = ctx.model('Tag');
    const tags = Tag.find({ _id: { $in: ids } });

    const data = pagination(path, posts, {
      perPage,
      layout: ['category', 'archive', 'index'],
      format: paginationDir + '/%d/',
      data: {
        ...page,
        tags
      }
    });

    return result.concat(data);
  }, []);
};

const getTagIds = (category) => {
  const posts = category.posts;
  const tag_ids = new Set();
  posts.map(post => post.tags.toArray())
    .reduce((res, tags) => res.concat(tags), [])
    .map(tag => tag._id)
    .forEach(id => {
      tag_ids.add(id);
    });
  return Array.from(tag_ids);
};
