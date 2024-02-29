const { src, dest, parallel, series, watch } = require('gulp');
const del		 = require('del');
const browserSync 	 = require('browser-sync').create();
const concat		 = require('gulp-concat');
const uglify		 = require('gulp-uglify-es').default;
const sass 			 = require('gulp-sass')(require('sass'));
const pug			 = require('gulp-pug');
const less			 = require('gulp-less');
const autoprefixer	 = require('gulp-autoprefixer');
const cleanCss	 	 = require('gulp-clean-css');
const prettify 		 = require('gulp-html-prettify');
const rename 		 = require('gulp-rename');
const changed 		 = require('gulp-changed');
const pxToRem 		 = require('gulp-px2rem-converter')


function browsersync() {
	browserSync.init({
		server: {baseDir: 'app/'},
		notify: false,
		// online: false // для работы без интернета
	})
}

function styles() {
	return src('app/scss/*.scss')
	.pipe(sass())
	// .pipe(concat('style.min.css'))
	.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
	.pipe(cleanCss(( {level: { 1: {specialComments: 0 } } ,  format: 'beautify'  } ))) //format: 'beautify'} ))) Это для красивого развернутого кода
	// .pipe(pxToRem())
	.pipe(dest('app/css/'))
	.pipe(browserSync.stream())
}

function htmls() {
	return src('app/pug/*.pug')
	.pipe(pug({
		pretty: true
	}))
	.pipe(prettify({indent_char: ' ', indent_size: 2}))
	.pipe(dest('app/'))
	.pipe(browserSync.stream())
}

function scripts() {
	return src('app/js/main.js')
	.pipe(concat('app.min.js'))
	.pipe(uglify())
	.pipe(dest('app/js/'))
	.pipe(browserSync.stream())
}


function startwatch() {
	watch(['app/**/*.js', '!app/**/*.min.js'], scripts);
	watch('app/**/*.pug').on('change', htmls, browserSync.reload);
	watch('app/**/*.html').on('change', browserSync.reload);
	watch('app/**/*.scss', styles);
}

exports.browsersync = browsersync;
exports.scripts 	= scripts;
exports.styles 		= styles;
exports.htmls 		= htmls;

exports.default 	= parallel(scripts, htmls, styles, browsersync, startwatch);




