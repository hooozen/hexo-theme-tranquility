/* global ctx */

"use strict";

const pagination = require("hexo-pagination");

module.exports = (ctx) => {
  ctx.config.subpage_generator = Object.assign(
    {
      per_page:
        typeof ctx.config.per_page === "undefined" ? 10 : ctx.config.per_page,
    },
    ctx.config.subpage_generator
  );

  ctx.extend.generator.register("subpage", subpage_generator);
  ctx.extend.generator.register("blog", blog);
};

function blog(locals) {
  const config = this.config;
  const posts = locals.posts.sort(config.index_generator.order_by);

  posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0));

  const paginationDir = config.pagination_dir || "page";

  return pagination("blog", posts, {
    perPage: config.index_generator.per_page,
    layout: ["category"],
    format: paginationDir + "/%d/",
    data: {
      name: "博客",
      icon: "blog",
    },
  });
}

function subpage_generator(locals) {
  if (!this.theme.config.subpage.enable) {
    return;
  }

  const orderBy = this.config.subpage_generator.order_by || "-date";
  const posts = locals.posts.sort(orderBy);
  posts.data.sort((a, b) => (b.sticky || 0) - (a.sticky || 0));

  const pagesData = getPagesData(this, locals);

  const routes = pagesData.reduce(
    (routes, data) => routes.concat(generateSubpage(this, data)),
    []
  );
  console.log(routes);
  return routes;
}

const getTagIds = (posts) => {
  const tag_ids = new Set();
  posts
    .map((post) => post.tags.toArray())
    .reduce((res, tags) => res.concat(tags), [])
    .map((tag) => tag._id)
    .forEach((id) => {
      tag_ids.add(id);
    });
  return Array.from(tag_ids);
};

const groupPostsBySubpage = (locals, subpages) => {
  return subpages.map((subpage) => {
    const posts = locals.categories.findOne({ name: subpage.name })?.posts;
    return {
      subpage,
      // posts: relinkPosts(posts),
      posts,
    };
  });
};

const groupPostsByLanguage = (posts, languages) => {
  return languages.map((language, i) => {
    const filteredPosts = posts.filter((post) => {
      return post.lang === language || (i === 0 && !post.lang);
    });

    return {
      language,
      // posts: relinkPosts(filteredPosts),
      posts: filteredPosts,
    };
  });
};

const relinkPosts = (posts) => {
  posts.reduce((pre, cur) => {
    pre.next = cur;
    cur.prev = pre;
    return cur;
  });

  if (posts.data[0]) {
    posts.data[0].prev = null;
  }
  if (posts.data[posts.data.length - 1]) {
    posts.data[posts.data.length - 1].next = null;
  }

  return posts;
};

const getPagesData = (hexo, locals) => {
  const subpages = hexo.theme.config.subpage.pages;
  const subpageGroups = groupPostsBySubpage(locals, subpages);

  const languages = hexo.config.language?.filter((lang) => lang !== "default");

  if (!Array.isArray(languages) || languages.length < 2) {
    return subpageGroups.map((group) => {
      const { subpage, posts } = group;
      const path = subpage.path || subpage.name;
      return {
        path: path.endsWith("/") ? path : `${path}/`,
        data: {
          posts,
          ...subpage,
          language: null,
        },
      };
    });
  }

  return subpageGroups.reduce((pages, group) => {
    const { subpage, posts } = group;
    let path = subpage.path || subpage.name;
    path = path.endsWith("/") ? path : `${path}/`;
    const languageGroups = groupPostsByLanguage(posts, languages);
    const subpagePages = languageGroups.map((page, i) => ({
      path: i === 0 ? path : `${page.language}/${path}`,
      data: {
        ...subpage,
        ...page,
      },
    }));
    return pages.concat(subpagePages);
  }, []);
};

const generateSubpage = (hexo, pageData) => {
  const perPage = hexo.config.subpage_generator.per_page;
  const paginationDir = hexo.config.pagination_dir || "page";

  const { path, data } = pageData;
  const { posts, title } = data;

  if (!posts?.length) {
    console.warn(`Warn: There is no post in subpage '${title}'`);
    console.log(posts);
    return [
      {
        path,
        layout: ["category"],
        data,
      },
    ];
  }

  const tagIds = getTagIds(posts);

  const allTags = hexo.model("Tag");
  const tags = allTags.find({ _id: { $in: tagIds } });

  return pagination(path, posts, {
    perPage,
    layout: ["category"],
    format: `${paginationDir}/%d/`,
    data: {
      ...data,
      tags,
    },
  });
};
