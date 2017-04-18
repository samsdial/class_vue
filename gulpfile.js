var browserSync = require('browser-sync');
var gulp = require('gulp');
var sass = require('gulp-sass');
var pug = require('gulp-pug');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var webpack = require('webpack-stream');

gulp.task('compile-sass', function() {
    gulp.src('src/sass/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('docs/css/'))
        .pipe(browserSync.stream());
});

gulp.task('compile-pug', function() {
    gulp.src('src/pug/**/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('docs'))
        .pipe(browserSync.stream());
});
gulp.task('babel', function(){
    return gulp.src('src/js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('docs/js/'))
        .pipe(browserSync.stream());
});
gulp.task('webpack', ['babel'], function(){
    return gulp.src('docs/js/main.js')
        .pipe(webpack({
            output: {
                path: '/docs/js/packed',
                filename: 'app.js'
            },
        }))
        .pipe(gulp.dest('docs/js/packed'))
        .pipe(browserSync.stream());
});


gulp.task('watch', function() {
    browserSync.init({
        notify: false,
        proxy: 'localhost:8000'
    });

    gulp.watch('src/sass/**/*.sass', ['compile-sass']);
    gulp.watch('src/js/**/*.js', ['babel']);
    gulp.watch('docs/js/main.js', ['webpack']);
    gulp.watch('src/pug/**/*.pug', ['compile-pug']);
});

gulp.task('default', ['compile-sass', 'compile-pug', 'babel', 'webpack']);
