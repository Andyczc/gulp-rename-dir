'use strict';
var fs = require('fs');
var path = require('path');
var del = require('rimraf');

var bakBuild = function(tmpPath, destPath, bakPath, cb){
    fs.rename(destPath, bakPath, function(err){
        if(err){
            console.log('原部署目录重命名失败');
            cb();
        } else {
            creatBuild(tmpPath, destPath, bakPath, cb);
        }
    });
};

var creatBuild = function(tmpPath, destPath, bakPath, cb){
    fs.rename(tmpPath, destPath, function(err){
        if(err){
            console.log('新部署目录重命名失败，网站已经无法访问，请尽快解决');
            cb();
        } else {
            // console.log('部署完成');
            rmDir(bakPath, cb);
        }
    });
};

var rmDir = function(pathFull, cb){
	del(pathFull, cb);
}

module.exports = function (tmpPath, destPath, bakPath, opts, callback) {

	if( typeof tmpPath === 'object' ){
		opts = tmpPath;
		callback = typeof destPath == 'function'? destPath: function(){};
		tmpPath = opts.tmpPath;
		destPath = opts.destPath;
		bakPath = opts.bakPath;
	} else {
		opts = opts || {};
	}

	if (!tmpPath || !destPath) {
		throw new gutil.PluginError('gulp-rename-dir', '`tmpPath` and `destPath` required');
	}

	bakPath = bakPath || (path.dirname(destPath) + '/dist_bak_'+ Date.now());

	opts.cwd = opts.cwd || process.cwd();

	tmpPath = path.resolve(opts.cwd, tmpPath);
	destPath = path.resolve(opts.cwd, destPath);
	bakPath = path.resolve(opts.cwd, bakPath);

	if(fs.existsSync(destPath)){
		if(fs.existsSync(bakPath)){
			rmDir(bakPath, function(){
				bakBuild(tmpPath, destPath, bakPath, callback);
			});
		} else {
            bakBuild(tmpPath, destPath, bakPath, callback);
        }
	} else {
		creatBuild(tmpPath, destPath, bakPath, callback);
	}
};
