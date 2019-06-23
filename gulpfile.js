const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const plumber = require('gulp-plumber');
const lr = require('tiny-lr');
const livereload = require('gulp-livereload');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin')
const concat = require('gulp-concat'); 
const connect = require('connect');
    server = lr();

gulp.task('js', function() {
    gulp.src(['./assets/js/*.js'])
    //   .pipe(concat('all.js'))
	//	.pipe(uglify())
        .pipe(gulp.dest('./public/js'))
        .pipe(livereload(server)); 
});

gulp.task('css', function() {
    gulp.src(['./assets/css/*.css'])
       // .pipe(concat('all.css'))
		.pipe(cleanCSS())
        .pipe(gulp.dest('./public/css'))
        .pipe(livereload(server)); 
});


gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static('./public'))
        .listen('9000');
    console.log('Server listening on http://localhost:9000');
});

gulp.task('watch', function() {
    gulp.run('js');
	gulp.run('css');
	
    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('assets/css/*.css', function() {
            gulp.run('css');
        });
        gulp.watch('assets/img/*', function() {
            gulp.run('images');
        });
        gulp.watch('assets/js/*', function() {
            gulp.run('js');
        });
    });
    gulp.run('http-server');
});
