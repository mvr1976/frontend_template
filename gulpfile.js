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
  spritesmith = require('gulp.spritesmith'),
  stripCSS = require('gulp-strip-css-comments'),
  sftp = require('gulp-sftp');

/* --------- paths --------- */
const 
  paths = {
    jade: {
      watch: '_dev/jade/**/*.jade',
      src:   '_dev/jade/_pages/*.jade',
      dest:  '_build/' 
    },

    scss: {
      watch: '_dev/scss/**/*.scss',
      src:   '_dev/scss/*.scss',
      dest:  '_build/css/'
    },

    img: {
      all: '_dev/img/*',
      icons: ['_dev/img/icons/**/*.*', '!_dev/img/icons/**/*.md'],
      dest: '_build/img/'
    },

    js: {
      watch: '_dev/js/**/*.js',
      src:   '_dev/js/*.js',
      dest:  '_build/js/'
    },

    bower: {
      watch:   '_dev/bower/**',
      cssDest: '_build/css/',
      jsDest:  '_build/js/'
    },

    browserSync : {
      baseDir : '_build/',
      watch : ['_build/*.html', '_build/css/*.css', '_build/js/*.js']
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
    .pipe(stripCSS())
    .pipe(gulp.dest(paths.scss.dest))
})

/* ---------- sprite generator ---------- */

gulp.task('spriteIcons', function() {
    var spriteData = 
        gulp.src(paths.img.icons) // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgName: 'spriteIcons.png',
                cssName: '_spriteIcons.scss',
                cssFormat: 'scss',
                cssSpritesheetName: 'icons',
                cssVarMap: function (sprite) {
                  sprite.name = 'icon-' + sprite.name;
                }
            }));
    spriteData.img.pipe(gulp.dest(paths.img.dest)); // путь, куда сохраняем картинку
    spriteData.css.pipe(gulp.dest('_dev/scss/_misc/')); // путь, куда сохраняем стили
});

// gulp.task('spritesSocial', function() {
//     var spriteData = 
//         gulp.src(paths.img.iconsSocial) // путь, откуда берем картинки для спрайта
//             .pipe(spritesmith({
//                 imgName: '../img/spriteSocial.png',
//                 cssName: '_spriteSocial.scss',
//                 cssFormat: 'scss',
//                 cssSpritesheetName: 'social',
//                 cssVarMap: function (sprite) {
//                   sprite.name = 'icon-' + sprite.name;
//                 }
//             }));
//     spriteData.img.pipe(gulp.dest(paths.img.dest)); // путь, куда сохраняем картинку
//     spriteData.css.pipe(gulp.dest('_dev/scss/_misc/')); // путь, куда сохраняем стили
// });

/* ---------- image min ---------- */

gulp.task('imagemin', function() {
  del(paths.img.dest + '*.*')
  return gulp.src(paths.img.all)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.img.dest))
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

/* --------- sfpt --------- */

gulp.task('sftp', function () {
  return gulp.src('_build/*')
    .pipe(sftp({
      host: 'website.com',
      user: 'johndoe',
      pass: '1234'
    }));
});

/* --------- watch --------- */

gulp.task('watch', function(){
  gulp.watch([paths.jade.watch, paths.bower.watch], ['jade']);
  gulp.watch(paths.scss.watch, ['scss']);
  gulp.watch(paths.img.all, ['imagemin']);
  gulp.watch(paths.img.icons, ['spriteIcons']);
  gulp.watch(paths.js.watch, ['js']);
  gulp.watch(paths.browserSync.watch).on('change', browserSync.reload);
});

/* --------- default --------- */

gulp.task('default', ['jade', 'scss', 'imagemin', 'spriteIcons', 'js', 'sync', 'watch']);

