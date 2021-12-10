const { src, dest, watch, parallel } = require(`gulp`);

//HTML
const htmlMin = require("gulp-htmlmin");

//CSS
const autoprefixer = require(`autoprefixer`);
const cssnano = require(`cssnano`);
const postcss = require(`gulp-postcss`);
const sourcemaps = require(`gulp-sourcemaps`);

//PLUMBER
const plumber = require(`gulp-plumber`);

//IMAGENES
const cache = require(`gulp-cache`);
const imgMin = require(`gulp-imagemin`);
const webp = require(`gulp-webp`);
const avif = require(`gulp-avif`);

//JAVASCRIPT
const babel = require(`gulp-babel`);
const terser = require(`gulp-terser-js`);

//CONCAT
const concat = require(`gulp-concat`);

//HTML
function html(done) {
  const options = {
    collapseWhitespace: true,
    removeComments: true,
  };

  src("src/views/**/*.html")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(htmlMin(options))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest("public/"));

  done();
}

//CSS
function css(done) {
  src(`src/styles/**/*.css`) //Identificar el archivo sass a compilar
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat(`styles.css`))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`public/styles`)); //Almacenar en el disco duro

  done();
}

//IMAGENES
function img(done) {
  const options = {
    optimizationLevel: 3,
  };

  src(`src/assets/img/**/*.{png,jpg}`)
    .pipe(plumber())
    .pipe(cache(imgMin(options)))
    .pipe(dest(`public/assets/img`));

  done();
}

function vWebp(done) {
  const options = {
    quality: 50,
  };

  src(`src/assets/img/**/*.{png,jpg}`)
    .pipe(plumber())
    .pipe(webp(options))
    .pipe(dest(`public/assets/img`));

  done();
}

function vAvif(done) {
  const options = {
    quality: 50,
  };

  src(`src/assets/img/**/*.{png,jpg}`)
    .pipe(plumber())
    .pipe(avif(options))
    .pipe(dest(`public/assets/img`));

  done();
}

//JAVASCRIPT
function javaScript(done) {
  src(`src/js/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(concat("scripts-min.js"))
    .pipe(plumber())
    .pipe(babel())
    .pipe(terser())
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`public/js`));

  done();
}

function dev(done) {
  watch(`src/views/**/*.html`);
  watch(`src/styles/**/*.scss`, css);
  watch(`src/js/**/*.js`, javaScript);

  done();
}

exports.html = html;
exports.css = css;
exports.js = javaScript;
exports.img = img;
exports.vWebp = vWebp;
exports.vAvif = vAvif;
exports.dev = parallel(html, javaScript, img, vWebp, vAvif, dev);
