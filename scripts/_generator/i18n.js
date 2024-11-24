module.exports = (ctx) => {
  const languages = ctx.config.language;

  if (!Array.isArray(languages) || languages.length < 2) {
    return;
  }

  ctx.extend.generator.register("i18n", i18n);
};

async function i18n(locals) {
  const generators = this.extend.generator.list();
  const languages = this.config.language
    .filter((lang) => lang !== "default")
    .slice(1);

  const generatorToI18n = ["index", "tag", "cv"];

  const generatorReuslts = await Promise.all(
    generatorToI18n.map((name) => generators[name].call(this, locals))
  );

  const originalRoutes = generatorReuslts.reduce((routes, partialRoutes) => {
    return routes.concat(partialRoutes);
  }, []);

  return originalRoutes.reduce((i18Routes, route) => {
    const routes = languages.map((language) => ({
      ...route,
      path: `${language}/${route.path}`,
      data: {
        ...route.data,
        language,
      },
    }));
    return i18Routes.concat(routes);
  }, []);
}
