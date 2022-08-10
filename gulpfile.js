/* Importar funciones de gulp */
const { src, dest, watch, parallel } = require(`gulp`);

//Plugins HTML
const htmlMin = require("gulp-htmlmin");// Minifica HTML

//Plugins para CSS
const autoprefixer = require(`autoprefixer`);
const cssnano = require(`cssnano`);
const postcss = require(`gulp-postcss`);
const clean = require(`gulp-purgecss`); //Limpia estilos CSS no usados

//Plugins para imágenes
const imgMin = require(`gulp-imagemin`);//Optimiza imágenes
const cache = require(`gulp-cache`);
const webp = require(`gulp-webp`);
const avif = require(`gulp-avif`);

//Plugins extra
const plumber = require(`gulp-plumber`);
const concat = require(`gulp-concat`); // Concatena ficheros
const cacheBust = require(`gulp-cache-bust`);
const sourcemaps = require(`gulp-sourcemaps`);

/** HTML
 * Toma todos los archivos HTML en la carpeta `src/views`, las minimiza, agrega una marca de tiempo al nombre del archivo, y los envía a la carpeta `public`
 * @param done - Esta es una función callback que le dice a gulp cuando la tarea se completó.
 */
function html(done) {
  const options = {
    collapseWhitespace: true,
    removeComments: true,
  };
  const cache = {
    type: `timestamp`,
  };

  src("src/views/**/*.html")
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(htmlMin(options))
    .pipe(cacheBust(cache))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest("public/"));

  done();
}

/** CSS
 * Toma todos los archivos CSS en la carpetasrc/styles, los concatena en un solo archivo styles.css, agrega prefijos de proveedores  a las reglas de CSS, minifica, y escribe un sourcemap en la carpeta public/styles
 * @param done - Es una función callback que indica a gulp cuando la tarea terminó.
 */
function css(done) {
  src(`src/styles/**/*.css`) 
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(concat(`styles.css`))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write(`.`))
    .pipe(dest(`public/styles`)); 

  done();
}


/**
 * Esta función limpia los estilos que no se usan 
 * @param done - Es una función callback que indica a gulp cuando la tarea terminó.
 */
function cleanCSS(done) {
  const content = {
    content: [`public/*.html`],
  };

  src(`public/styles/styles.css`)
    .pipe(clean(content))
    .pipe(dest(`public/styles`));

  done();
}

/**
 * Toma las imágenes en la carpeta `src/assets/img`, los optimiza, y las guarda en la carpeta `public/assets/img`
 * @param done - Indica a gulp cuando una tarea terminó.
 */
function img(done) {
  const options = {
    optimizationLevel: 3,
  };

  src(`src/assets/img/**/*.{png,jpg,svg}`)
    .pipe(plumber())
    .pipe(cache(imgMin(options)))
    .pipe(dest(`public/assets/img`));

  done();
}

/**
 * Toma las imágenes en la carpeta `src/assets/img`, los convierte al formato Webp, y las guarda en la carpeta `public/assets/img`
 * @param done - Indica a gulp cuando una tarea terminó.
 */
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

/**
 * Toma las imágenes en la carpeta `src/assets/img`, los convierte al formato AVIF, y las guarda en la carpeta `public/assets/img`
 * @param done - Indica a gulp cuando una tarea terminó.
 */
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

/**
 * Observa los cambios en el HTML, CSS y las imágenes y corre las tareas respectivas para ejecutar los cambios detectados.
 * @param done - Es una función callback que indica a gulp cuando la tarea terminó.
 */
function dev(done) {
  watch(`src/views/**/*.html`, html);
  watch(`src/styles/**/*.css`, css);
  watch(`src/assets/img/**/*.{png,jpg,svg}`, img);

  done();
}

/* Exporta las funciones que se utilizan en el gulpfile.js */
exports.html = html;
exports.css = css;
exports.clean = cleanCSS;
exports.img = img;
exports.vWebp = vWebp;
exports.vAvif = vAvif;
exports.dev = parallel(img, vWebp, vAvif, dev);
