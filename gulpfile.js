var gulp = require('gulp'),
    header = require('gulp-header'),
    markdox = require('gulp-markdox'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    pkg = require('./package.json'),
    banner = ['/**',
                ' * <%= pkg.name %>',
                ' * @version v<%= pkg.version %>',
                ' * @license <%= pkg.licenses[0].type %>',
                ' * @license Multiple others by Lodash, Q and superagent',
                ' */\n'
             ].join('\n');


gulp.task('APIref', function () {
    return gulp.src('lib/**/*.js')
        .pipe(markdox())
        .pipe(concat('API.md'))
        .pipe(gulp.dest('./docs'));
});


gulp.task('docs', ['APIref'], function () {
    return gulp.src(['docs/README.md', 'docs/API.md'])
        .pipe(concat('README.md'))
        .pipe(gulp.dest('./'));
});


gulp.task('browser-build', function () {

    var bundler = browserify({
        entries: ['./lib/browser-export.js'],
        debug: true
    });

    var bundle = function () {
        return bundler
            .bundle()
            .pipe(source(pkg.name + '.' + 'min.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            // Add transformation tasks to the pipeline here.
            .pipe(uglify())
            .pipe(header(banner, {
                pkg: pkg
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build/'));
    };

    return bundle();
});
