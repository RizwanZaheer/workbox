const babel = require('gulp-babel');
const gulp = require('gulp');
const oneLine = require('common-tags').oneLine;
const path = require('path');

const constants = require('./constants');
const logHelper = require('../../infra/utils/log-helper');
const pkgPathToName = require('./pkg-path-to-name');

module.exports = (packagePath) => {
  const packageName = pkgPathToName(packagePath);
  const outputDirectory = path.join(packagePath,
    constants.PACKAGE_BUILD_DIRNAME);

  logHelper.log(oneLine`
    Building Node Package for
    ${logHelper.highlight(packageName)}.
  `);

  return gulp.src(`${packagePath}/src/**`).pipe(babel({
    only: /\.js$/,
    presets: [
      ['env', {
        targets: {
          // Change this when our minimum required node version changes.
          node: '4.0',
        },
      }],
    ],
    plugins: [
      // This ensures that the helpers used by Babel to accompany transpilation
      // are only included in our Rollup bundles once, even if they're used
      // in multiple source files.
      // See https://github.com/rollup/rollup-plugin-babel#helpers
      'transform-runtime',
    ],
  })).pipe(gulp.dest(outputDirectory));
};
