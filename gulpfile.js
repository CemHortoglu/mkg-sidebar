gulp= require('gulp');
sass= require('gulp-sass');
sync = require('browser-sync').create();
plumber = require('gulp-plumber');
rename = require('gulp-rename');
babel = require('gulp-babel');
sourcemaps  = require('gulp-sourcemaps');
autoprefixer = require('gulp-autoprefixer');



gulp.task('sass',function () {
    return gulp.src('src/*.scss')
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(sync.reload({stream:true}));
})

gulp.task('script',function () {
    return gulp.src(['src/*.js','src/*.es6'])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(babel())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(sync.reload({stream:true}));
})

gulp.task('html',function () {
    sync.reload();
})


gulp.task('default',function () {
    serve();
    gulp.watch('src/*.scss',['sass']);
    gulp.watch(['src/*.js','src/*.es6'],['script']);
    gulp.watch('*.html',['html']);
});


function serve() {
    sync.init({
        server: {
          baseDir: './'
        },
    })
}
