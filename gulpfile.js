const { src, dest, watch, series } = require('gulp')

const pug = require('gulp-pug')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const notify = require('gulp-notify')
const uglify = require('gulp-uglify')
const lineec = require('gulp-line-ending-corrector')
const autoprefixer = require('gulp-autoprefixer')
const copy   = require('gulp-copy')
const browserSync = require('browser-sync').create()


// 1. Compile PUG files into HTML
function html() {
  return src('src/pug/*.pug')
    .pipe(pug({
      pretty: true
    }))
    // .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(dest('dist'))
}


// 2. Compile SASS files into CSS
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

// 3. Copy assets
function assets() {
  return src('src/assets/**/*')
    .pipe(dest('./dist/'))    
}


// 3b. Copy css
function copyCSS() {
  return src('src/css/*.css')
    .pipe(dest('./dist/css'))
}

// 4. Copy Font Awesome
function fonts(){
  return src([
     'node_modules/@fortawesome/fontawesome-free/webfonts/**/*',        
    ])
    .pipe(dest('./dist/webfonts'))
}

// 5. Concat CSS
// Used to concat the files in a specific order.
var cssSRC = [
  'dist/css/fontawesome-all.css',
  'dist/css/bootstrap.min.css',
  'dist/css/main.css'
];

// Concat SASS
function concatCSS() {
  return src(cssSRC)
    .pipe(concat('style.css'))   
    .pipe(dest('dist/'))
    .pipe(browserSync.stream())
  }

// 6. Concat JS
// Used to concat the files in a specific order.
var jsSRC = [
  'src/js/jquery-3.3.1.min.js',
  'src/js/bootstrap.min.js',
  'src/js/main.js'  
];

function javascript() {
  return src(jsSRC)  
  .pipe(concat('script.js'))
  // .on('error', concat.logError)
  .pipe(uglify())
  .pipe(lineec())
  .pipe(dest('dist/'))
  .pipe(browserSync.stream())
}
// ---------------


// 7. Serve and watch sass/pug files for changes
function watchAndServe() {
  browserSync.init({
    server: 'dist',
  })
  watch('src/sass/**/*.sass', styles)
  watch('src/js/*.js', javascript)
  watch('src/css/**/*', copyCSS)
  watch('src/css*.css', concatCSS)
  watch('src/pug/**/*.pug', html)
  watch('src/assets/**/*', assets)
  watch('dist/*.html').on('change', browserSync.reload)
}


exports.html = html
exports.styles = styles
// exports.copyCSS = copyCSS
// exports.concatCSS = concatCSS
exports.watch = watchAndServe
exports.default = series(html, styles, concatCSS, assets, fonts, javascript, watchAndServe)