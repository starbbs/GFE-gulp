﻿// 张树垚 2015-12-04 09:49:51 创建
// gulp工具 -- 文件转移

'use strict';

/**
 * [fileMove 文件转移]
 * @Author   张树垚
 * @DateTime 2015-12-04 14:59:34
 * @param    {[string|array]}      input                   [输入路径]
 * @param    {[string|function]}   output                  [输出路径]
 * @param    {[json]}              options                 [参数]
 *           {[string]}            options.type            [参数: 文件类型(all:所有, file:文件)]
 *           {[RegExp]}            options.fileReg         [参数: 要加入的文件名正则验证]
 *           {[string]}            options.baseUrl         [参数: 文件基本目录]
 *           {[function]}          options.rename          [参数: 选出的文件重命名函数(默认path.dirname清空)]
 *           {[boolean]}           options.removeDirname   [参数: 是否移除文件路径, 默认true]
 *           {[boolean]}           options.minifyHtml      [参数: 是否使用html压缩]
 *           {[boolean]}           options.imagemin        [参数: 是否使用图片压缩]
 *           {[boolean]}           options.uglify          [参数: 是否使用js压缩]
 *           {[string]}            options.server          [参数: 要输出到的服务器文件夹路径]
 * @return   {[gulp-stream]}
 * @用法:
 * gulp.task('img-move', function() {
 * 		return tools.imgMove('INPUT PATH', 'OUTPUT PATH', { fileReg: /^_/ });
 * });
 */
module.exports = function(input, output, options) {
	let gulp = require('gulp');
	let rename = require('gulp-rename');
	let minifyHtml = require('gulp-minify-html');
	let imagemin = require('gulp-imagemin');
	let uglify = require('gulp-uglify');
	let filePath = require('./05 file-path 路径处理.js');
	options = options || {};
	if (typeof options.removeDirname === 'undefined') {
		options.removeDirname = true;
	}
	return gulp.src(input, function(somethingNULL, filePaths) {
		// console.log(filePaths);
		if (!filePaths.length) {
			return;
		}
		// 选择
		let baseFile = filePath(filePaths[0]);
		let baseUrl = baseFile.type === 'dir' ? baseFile.origin : baseFile.path; // 根路径
		let files = filePaths.filter(function(path) { // 文件筛选
			path = filePath(path);
			// 指定文件类型
			if (options.type === path.type) {
				return options.fileReg ? options.fileReg.test(path.filename) : true;
			}
			// 未指定或全部
			if (options.type === 'all' || typeof options.type === 'undefined') {
				return true;
			}
			// 所有文件
			if (options.type === 'file') {
				return path.type !== 'dir';
			}
		});
		if(options.imagemin){
			let stream = gulp.src(files, {
				base: options.baseUrl || baseUrl
			}).pipe(rename(function(path) {
				options.rename && options.rename(path);
				options.removeDirname && (path.dirname = '');
			})).pipe(imagemin()).pipe(gulp.dest(output));
		}else{
			let stream = gulp.src(files, {
				base: options.baseUrl || baseUrl
			}).pipe(rename(function(path) {
				options.rename && options.rename(path);
				options.removeDirname && (path.dirname = '');
			})).pipe(gulp.dest(output));
		}

	});
};