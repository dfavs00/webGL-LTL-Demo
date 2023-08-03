const path = require('path');

module.exports = function override(config, env) {
  // Add support for importing GLSL files
  config.module.rules.push({
    test: /\.(glsl|vs|fs|vert|frag)$/,
    type: 'asset/source',
  });

  return config;
}
