'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');


gulp.task('default', ['serve']);

gulp.task('serve', ['nodemon'], function() {
	// browserSync.init(null, {

	// 	proxy: "http://localhost:3000",
 //        files: ["/public/*.*"],
 //        browser: "google chrome",
 //        port: 3000
	// });
	browserSync.init({
		server: {
	        baseDir: "./public",
    		//index: "entersite.html"
	    },port:3000
    });
    gulp.watch([
	    'public/*.html',
	    'public/css/*.css',
	    'public/js/*.js',
	    'public/img/*'
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

// var gulp        = require('gulp');
// var browserSync = require('browser-sync').create();
// var reload      = browserSync.reload;
// var server = require('gulp-express');

// gulp.task('serve', function () {
// 	// browserSync.init({
// 	// 	server: {
// 	//         baseDir: "./public",
// 	//     },port:3000
//  //    });
// 	server.run(['server.js']);
//     // Serve files from the root of this project
//     //gulp.watch("public/*.html").on('change', browserSync.reload);
//    //  gulp.watch([
// 	  //   'public/*.html',
// 	  //   'public/css/*.css',
// 	  //   'public/js/*.js',
// 	  //   'public/img/*'
//   	// ]).on('change', reload);

// 	// Restart the server when file changes 
//     gulp.watch(['public/*.html'], server.notify).on('change', reload);
//     //gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
//     //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]); 
//     //Event object won't pass down to gulp.watch's callback if there's more than one of them. 
//     //So the correct way to use server.notify is as following: 
//     gulp.watch(['public/css/*.css'], function(event){
//         gulp.run('styles:css');
//         server.notify(event);
//         //pipe support is added for server.notify since v0.1.5, 
//         //see https://github.com/gimm/gulp-express#servernotifyevent 
//     }).on('change', reload);
//     gulp.watch(['public/js/*.js'], ['jshint']).on('change', reload);
//     gulp.watch(['public/img/*'], server.notify).on('change', reload);
//     gulp.watch(['server.js', '*.js'], [server.run]).on('change', reload);
// });

// gulp.task('default', ['serve']);


