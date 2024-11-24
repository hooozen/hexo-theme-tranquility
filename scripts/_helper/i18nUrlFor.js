module.exports = (hexo) => {
  const url_for = hexo.extend.helper.get("url_for").bind(hexo);

  const defaultLanguage = hexo.config.language?.[0];
  const root = hexo.config.root;

  hexo.extend.helper.register("i18n_url_for", (language, path, config) => {
    const url = url_for(path, config);
    if (!defaultLanguage || !language || language === defaultLanguage) {
      return url;
    }
    if (!root || root === "/") {
      return `/${language}${url}`;
    }
    return url.replace(RegExp(root), `${root}${language}/`);
  });
};
