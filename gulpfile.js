'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');

gulp.task('serve', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:8888",
        files: ["/public/*.*"],
        browser: "chrome",
        port: 3000
	});
	// browserSync.init({
	// 	server: {
	//         baseDir: "./public",
 //    		//index: "entersite.html"
	//     },port:8000
 //    });
    gulp.watch([
	    'public/*.html',
	    'public/css/*.css',
	    'public/js/*.js',
	    'public/img/*',
	    'public/backend/*.html',
	    'public/templates/*.html'
  	]).on('change', browserSync.reload);
});
gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'server.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});

gulp.task('default', ['serve']);