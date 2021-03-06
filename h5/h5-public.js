
// 张树垚 2015-12-10 15:05:15  创建
// gulp H5微信端 生成到public文件夹


var gulp = require('gulp');
var path = require('path');

var tools = require('../tools');
var paths = require('./h5-paths');

var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

var version=(new Date()).valueOf();//版本号

gulp.task('h5-pjs', function() {
	return gulp.src(path.join(paths.build, '/js/*.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.public + '/js'))
});

gulp.task('h5-prjs', ['h5-pjs'], function() {
	return tools.rjs(paths.build + '/*.html', paths.public + '/js', {
		rjsPaths: paths.rjs,
		uglify: true,
		isOnline:false
	});
});

gulp.task('h5-phtml', function() {
	return tools.html(paths.build + '/*.html', paths.public, {
		remove: '<script src="./js/config.js"></script>',
		oldChar: '.js',
		newChar: '.js?version='+version,
		oldChar1: '.css',
		newChar1: '.css?version='+version,
	});
});

gulp.task('h5-pimg', function() {
	return tools.fileMove(paths.build + '/images/**/**', paths.public + '/images', {
		type: 'image',
		imagemin: true,
		removeDirname: false
	});
});

gulp.task('h5-psprite', function() {
	return tools.cssSprite(path.join(paths.build, '/css/*.css'), {
		css: path.join(paths.public + '/css'),
		img: path.join(paths.public + '/images')
	})
});

gulp.task('h5-pfont', function() {
	return gulp.src(paths.build + '/font/**')
		.pipe(gulp.dest(paths.public + '/font'));
});


gulp.task('h5-public', ['h5-prjs', 'h5-phtml', 'h5-pimg', 'h5-psprite', 'h5-pfont']);

