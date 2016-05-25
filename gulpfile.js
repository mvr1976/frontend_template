'use strict';

/* --------- plugins --------- */
var
	gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	jade = require('gulp-jade'),
	scss = require('gulp-sass'),
	cleancss = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	del = require('del'),
  wiredep = require('wiredep').stream,
  gulpif = require('gulp-if'),
  useref = require('gulp-useref'),
	spritesmith = require('gulp.spritesmith');

/* --------- paths --------- */
const 
	paths = {
		jade: {
			watch: '_dev/jade/**/*.jade',
			src:   '_dev/jade/_pages/*.jade',
			dest:  '_build' 
		},

		scss: {
			watch: '_dev/scss/**/*.scss',
			src:   '_dev/scss/*.scss',
			dest:  '_build/css'
		},

		js: {
			watch: '_dev/js/**/*.js',
			src:   '_dev/js/*.js',
			dest:  '_build/js'
		},

		bower: {
			watch:   '_dev/bower/**',
			cssDest: '_build/css',
			jsDest:  '_build/js'
		},

		browserSync : {
			baseDir : '_build',
			watch : ['_build/	*.html', '_build/css/*.css', '_build/js/*.js']
		}
	};

/* --------- browser sync --------- */

gulp.task('sync', function() {
	browserSync.init({
		server: {
			baseDir: paths.browserSync.baseDir
		}
	});
});

/* --------- jade --------- */

gulp.task('jade', ['clean'], function() {
	return gulp.src(paths.jade.src)
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t'
		}))
    .pipe(wiredep())
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cleancss()))
		.pipe(gulp.dest(paths.jade.dest))
})

/* --------- scss --------- */

gulp.task('scss', function() {
	return gulp.src(paths.scss.src)
		.pipe(plumber())
		.pipe(scss({
			outputStyle: 'expanded'
		}))
		.pipe(gulp.dest(paths.scss.dest))
})

/* --------- js --------- */

gulp.task('js', function() {
	return gulp.src(paths.js.src)
		.pipe(plumber())
		.pipe(rename('main.js'))
		.pipe(gulp.dest(paths.js.dest))
})

/* --------- clean --------- */

gulp.task('clean', function() {
	return del([paths.bower.cssDest + '/vendor.min.css', paths.bower.jsDest + '/vendor.min.js'])
})

/* --------- watch --------- */

gulp.task('watch', function(){
	gulp.watch([paths.jade.watch, paths.bower.watch], ['jade']);
  gulp.watch(paths.scss.watch, ['scss']);
  gulp.watch(paths.js.watch, ['js']);
	gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});

/* --------- default --------- */

gulp.task('default', ['jade', 'scss', 'js', 'sync', 'watch']);

