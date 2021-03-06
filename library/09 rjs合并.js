// 张树垚 2015-12-07 11:19:40 创建
// gulp工具 -- 加载器合并

'use strict';

/**
 * [rjs 基于AMD加载器requirejs的打包工具]
 * @Author   张树垚
 * @DateTime 2016-01-06 11:47:54
 * @param    {[string]}                 input                 [输入路径]
 *                                                              后缀.html时按名称合并js文件夹中的js文件
 *                                                              后缀.js时直接
 * @param    {[string|array]}           output                [输出路径]
 * @param    {[json]}                   options               [参数]
 *           {[json]}                   options.rjsPaths      [参数: rjs配置]
 *           {[json]}                   options.uglify        [参数: 是否压缩js]
 * @return   {[gulp-stream]}
 */
module.exports = function (input, output, options) {
    let gulp = require('gulp');
    let rjs = require('gulp-requirejs');
    let uglify = require('gulp-uglify');
    let rename = require('gulp-rename');
    let replace = require("gulp-replace");
    let filePath = require('./05 file-path 路径处理.js');
    input = filePath(input);
    let build = function (baseUrl, name) { // 单个处理
        if (options.isOnline) {
            return rjs({
                baseUrl: baseUrl,
                // mainConfigFile: '../config.js',
                name: name,
                out: name + '.js',
                paths: options.rjsPaths,
                shim: {
                    jquery: {
                        exports: "jQuery"
                    },
                    $: {
                        exports: "jQuery"
                    }
                },
                include: [],
                module: [],
                // optimize: 'uglify'
            })
                .pipe(options.uglify ? uglify() : rename(function (path) {
                }))
                .pipe(replace(options.oldChar, options.newChar))
                .pipe(replace(options.oldChar1, options.newChar1))
                .pipe(replace(options.oldChar2, options.newChar2))
                .pipe(replace(options.oldChar3, options.newChar3))
                .pipe(replace(options.oldChar4, options.newChar4))
                .pipe(gulp.dest(output));
        } else {
            return rjs({
                baseUrl: baseUrl,
                // mainConfigFile: '../config.js',
                name: name,
                out: name + '.js',
                paths: options.rjsPaths,
                shim: {
                    jquery: {
                        exports: "jQuery"
                    },
                    $: {
                        exports: "jQuery"
                    }
                },
                include: [],
                module: [],
                // optimize: 'uglify'
            })
                .pipe(options.uglify ? uglify() : rename(function (path) {
                }))
                .pipe(gulp.dest(output));
        }

    };
    if (input.extname === 'html') { // 提取对应js
        gulp.src(input.origin, function (somethingNULL, filePaths) {
            filePaths.forEach(function (path) {
                path = filePath(path);
                if (filePath.type !== 'dir') {
                    build(path.path + '/js', path.basename);
                }
            });
        });
        // batch(input.path + '/js/*.js');
    } else if (input.extname === 'js') {
        if (input.type === 'js-all') { // 一堆js
            gulp.src(input.origin, function (somethingNULL, filePaths) {
                filePaths.forEach(function (path) {
                    path = filePath(path);
                    if (filePath.type !== 'dir') {
                        build(path.path, path.basename);
                    }
                });
            });
        } else { // 一个js
            build(input.path, input.basename);
        }
    } else {
        console.log('请输入后缀为html或js的文件路径');
    }
};