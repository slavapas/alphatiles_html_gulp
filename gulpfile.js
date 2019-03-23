const { src, dest, watch, series } = require('gulp')

const pug = require('gulp-pug')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const notify = require('gulp-notify')
const uglify = require('gulp-uglify')
const lineec = require('gulp-line-ending-corrector')
const autoprefixer = require('gulp-autoprefixer')
const browserSync = require('browser-sync').create()


// Compile PUG files into HTML
function html() {
  return src('src/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    // .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(dest('dist'))
}


// Compile SASS files into CSS
function styles() {
  return src('src/sass/main.sass')
    .pipe(sass({
      includePaths: ['src/sass'],
      errLogToConsole: true,
      // outputStyle: 'compressed',
      // onError: browserSync.notify
    }))
    // .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(autoprefixer({browsers: ['last 15 versions'], cascade: false}))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream())
}

// Copy assets
function assets() {
  return src('src/assets/**/*')
    .pipe(dest('dist/'))
}

// Concat SASS
function css() {
  return src('dist/css/*.css')
    .pipe(concat('style.css'))   
    .pipe(dest('dist/'))
  }

// Concat JS
// Used to concat the files in a specific order.
var jsSRC = [
  'src/js/jquery-3.3.1.min.js',
  'src/js/bootstrap.min.js',
  'src/js/main.js'  
];

function javascript() {
  return src('src/js/*.js')  
  .pipe(concat('script.js'))
  // .on('error', concat.logError)
  .pipe(uglify())
  .pipe(lineec())
  .pipe(dest('dist/js/'));
}
// ---------------


// Serve and watch sass/pug files for changes
function watchAndServe() {
  browserSync.init({
    server: 'dist',
  })
  watch('src/sass/**/*.sass', styles)
  watch('src/js/*.js', javascript)
  watch('dist/css/*.css', css)
  watch('src/pug/**/*.pug', html)
  watch('src/assets/**/*', assets)
  watch('dist/*.html').on('change', browserSync.reload)
}


exports.html = html
exports.styles = styles
exports.watch = watchAndServe
exports.default = series(html, styles, assets, watchAndServe)