module.exports = function() {
  const jestTransform = file =>
    require('jest-preset-angular/preprocessor').process(
      file.content,
      file.path,
      { globals: { __TRANSFORM_HTML__: true }, rootDir: __dirname }
    );

  var wallabyConfig = require('./.vscode/wallaby/wallaby-used');

  return {
    files: wallabyConfig.files,

    tests: wallabyConfig.tests,

    env: {
      type: 'node',
      runner: 'node'
    },

    testFramework: 'jest',

    compilers: {
      '**/*.html': file => ({
        code: jestTransform(file),
        map: { version: 3, sources: [], names: [], mappings: [] },
        ranges: []
      })
    },

    preprocessors: {
      'src/**/*.js': jestTransform
    },

    setup: function(wallaby) {
      var jestConfig = require('./jest.config');
      if (!jestConfig.moduleNameMapper) {
        var paths = require('./tsconfig').compilerOptions.paths;
        var jestModuleMaps = {};
        Object.keys(paths).forEach(key => {
          jestModuleMaps[key] =
            '<rootDir>/' + paths[key][0].replace('.ts', '.js');
        });
        jestConfig.moduleNameMapper = jestModuleMaps;
      }
      jestConfig.setupTestFrameworkScriptFile =
        '<rootDir>/wallaby-test-setup.js';
      wallaby.testFramework.configure(jestConfig);
    }
  };
};
