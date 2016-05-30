
// 张树垚 2015-12-10 15:05:15  创建
// gulp H5微信端 生成到public文件夹


var gulp = require('gulp');
var path = require('path');

var tools = require('../tools');
var paths = require('./h5-paths');

var uglify = require('gulp-uglify');

var replace = require('gulp-replace');

gulp.task('h5-js', function() {
	return gulp.src(path.join(paths.build, '/js/*.js'))
		.pipe(uglify())
		.pipe(replace('//goopal.xiaojian.me','//endpoint.goopal.com.cn'))
		.pipe(replace('//www.xiaojian.me/wx/','//www.goopal.com.cn/wx/'))
		.pipe(replace('wxe91980c4944999fe','wx55923db8dfb94e44'))
		.pipe(gulp.dest(paths.public + '/js'))
});

gulp.task('h5-rjs', ['h5-js'], function() {
	return tools.rjs(paths.build + '/*.html', paths.public + '/js', {
		rjsPaths: paths.rjs,
		uglify: true
	});
});

gulp.task('h5-html', function() {
	return tools.html(paths.build + '/*.html', paths.public, {
		remove: '<script src="./js/config.js"></script>',
		oldChar: '.js',
		newChar: '.js?version='+version,
		oldChar1: '.css',
		newChar1: '.css?version='+version,
	});
});

gulp.task('h5-img', function() {
	return tools.fileMove(paths.build + '/images/**/**', paths.public + '/images', {
		type: 'image',
		imagemin: true,
		removeDirname: false
	});
});

gulp.task('h5-sprite', function() {
	return tools.cssSprite(path.join(paths.build, '/css/*.css'), {
		css: path.join(paths.public + '/css'),
		img: path.join(paths.public + '/images')
	})
});

gulp.task('h5-font', function() {
	return gulp.src(paths.build + '/font/**')
		.pipe(gulp.dest(paths.public + '/font'));
});


gulp.task('h5-online', ['h5-rjs', 'h5-html', 'h5-img', 'h5-sprite', 'h5-font']);

