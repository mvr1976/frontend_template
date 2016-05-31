'use strict';

/* --------- plugins --------- */
var
  gulp = require('gulp'),
  browserSync = require('browser-sync').create(),
  jade = require('gulp-jade'),
  scss = require('gulp-sass'),
  autoprefix = require('gulp-autoprefixer'),
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

    fonts: {
      src:   ['_dev/fonts/**/*.*', '!_dev/fonts/*.md'],
      dest:  '_build/fonts/'
    },

    img: {
      all: ['_dev/img/**/*.*','!_dev/img/icons/*.*'],
      icons: ['_dev/img/icons/**/*.jpg', '_dev/img/icons/**/*.png'],
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
  return run_sync();
});

/* --------- jade --------- */

gulp.task('jade', ['clean'], function() {
  return run_jade();
})

/* --------- scss --------- */

gulp.task('scss', function() {
  return run_scss();
})

/* ---------- fonts ---------- */

gulp.task('fonts', function() {
  return run_fonts();
})

/* ---------- sprite generator ---------- */

gulp.task('spriteIcons', function() {
  return run_spriteIcons();
});

/* ---------- image min ---------- */

gulp.task('imagemin', function() {
  return run_imagemin();
})

/* --------- js --------- */

gulp.task('js', function() {
  return run_js();
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
  return run_watch();
});

/* ---------- gulp-series ---------- */

gulp.task('init', ['8']);

gulp.task('8', ['7'], function() {
  run_sync();
});

gulp.task('7', ['6'], function() {
  run_watch();
});

gulp.task('6', ['5'], function() {
  run_jade();
});

gulp.task('5', ['4'], function() {
  run_scss();
});

gulp.task('4', ['3'], function() {
  run_imagemin();
});

gulp.task('3', ['2'], function() {
  run_spriteIcons();
});

gulp.task('2', ['1'], function() {
  run_fonts();
});

gulp.task('1', function() {
  run_js();
});


/* ---------- functions ---------- */

function run_js() {
  return gulp.src(paths.js.src)
  .pipe(plumber())
  .pipe(rename('main.js'))
  .pipe(gulp.dest(paths.js.dest))
};

function run_fonts() {
  gulp.src(aths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
};

function run_spriteIcons() {
    var spriteData = 
        gulp.src(paths.img.icons) // путь, откуда берем картинки для спрайта
            .pipe(spritesmith({
                imgPath: '../img/spriteIcons.png',
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
};

function run_imagemin() {
  del(paths.img.dest + '**/*.*')
  return gulp.src(paths.img.all)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.img.dest))
};

function run_scss() {
  return gulp.src(paths.scss.src)
    .pipe(plumber())
    .pipe(scss({
      outputStyle: 'expanded'
    }))
    .pipe(autoprefix({ browsers: 'last 20 version' }))
    .pipe(stripCSS())
    .pipe(gulp.dest(paths.scss.dest))
};

function run_jade() {
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
};

function run_watch() {
  gulp.watch([paths.jade.watch, paths.bower.watch], ['jade']);
  gulp.watch(paths.scss.watch, ['scss']);
  gulp.watch(paths.fonts.src, ['fonts']);
  gulp.watch(paths.img.all, ['imagemin']);
  gulp.watch(paths.img.icons, ['spriteIcons']);
  gulp.watch(paths.js.watch, ['js']);
  gulp.watch(paths.browserSync.watch).on('change', browserSync.reload);
};

function run_sync() {
  browserSync.init({
    server: {
      baseDir: paths.browserSync.baseDir
    },
    browser: "Chrome",
    open: false
  });
};

/* --------- default --------- */

// gulp.task('default', ['jade', 'scss', 'fonts', 'imagemin', 'spriteIcons', 'js', 'sync', 'watch']);
gulp.task('default', ['init']);

