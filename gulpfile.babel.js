'use strict';
import gulp from 'gulp';
import mocha from 'gulp-mocha';
import named from 'vinyl-named';
import eslint from 'gulp-eslint';
import { exec } from 'child_process';
import istanbul from 'gulp-istanbul';
import webpack from 'webpack-stream';
import webpackEs5Config from './webpack-es5.config.babel.js';
import webpackEs6Config from './webpack-es6.config.babel.js';
import shell from 'gulp-shell';

const PATH = {
  allSrcJs: 'src/**/*.js',
  allTests: 'test/**/*.js',
  clientEntryPoint: 'src/index.js',
  gulpFile: 'gulpfile.babel.js',
  webpackEs5File: 'webpack-es5.config.babel.js',
  webpackEs6File: 'webpack-es6.config.babel.js'
};

gulp.task('lint', () =>
  gulp.src([
    PATH.allSrcJs,
    PATH.gulpFile,
    PATH.allTests,
    PATH.webpackEs5File,
    PATH.webpackEs6File
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
);

// gulp.task('test', ['lint'], () =>
//   gulp.src(PATH.allSrcJs)
//     .pipe(istanbul())
//     .pipe(istanbul.hookRequire())
//     .on('finish', function () {
//       gulp.src(PATH.allTests)
//         .pipe(mocha())
//         .pipe(istanbul.writeReports())
//         .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
//     })
// );

gulp.task('docs', ['lint'], () => {
  exec('node ./node_modules/.bin/jsdoc -c jsdoc.json', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`${stdout}`);
    console.log(`${stderr}`);
  });
});

gulp.task('build-es5', ['docs'], () =>
  gulp.src(PATH.clientEntryPoint)
  .pipe(webpack(webpackEs5Config))
  .pipe(gulp.dest('dist'))
);

gulp.task('build', ['build-es5'], () =>
  gulp.src(PATH.clientEntryPoint)
  .pipe(named())
  .pipe(webpack(webpackEs6Config))
  .pipe(gulp.dest('dist'))
);

gulp.task('runtest', ['build'], shell.task([
  'phantomjs simulator.js'
]));

gulp.task('watch', () =>
  gulp.watch(PATH.allSrcJs, ['build'])
);

gulp.task('watch-tests', () =>
  gulp.watch(PATH.allTests, ['runtest'])
);

gulp.task('default', ['watch-tests', 'watch', 'runtest']);
