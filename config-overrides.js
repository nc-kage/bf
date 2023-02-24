const { aliasDangerous, configPaths } = require('react-app-rewire-alias/lib/aliasDangerous')

module.exports = function override(config) {
  aliasDangerous({
    ...configPaths('tsconfig.json'),
  })(config);

  return config;
};
