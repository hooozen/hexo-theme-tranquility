/* global ctx */

'use strict';


module.exports = ctx => {
  ctx.extend.generator.register('cv', cvGenerator);
};

function cvGenerator(locals) {
  const config = this.theme.config;

  return {
    path: '/cv/index.html',
    layout: ['cv'],
    data: config.cv
  };
};

