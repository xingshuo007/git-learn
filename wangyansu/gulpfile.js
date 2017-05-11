var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify');
var concat=require('gulp-concat');
var browserify = require('gulp-browserify');
var server = require('gulp-webserver');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var url=require('url');
var datajson=require('./data/main.js');
var rev = require('gulp-rev');//更改版本名  加MD5后缀
var revCollector = require('gulp-rev-collector');
var minifyHTML   = require('gulp-minify-html');
gulp.task('default', function () {
    gulp.start('jsmin');
});

gulp.task('jsmin', function () {
    return gulp.src('src/js/*.js')
        .pipe(uglify())//压缩
        //.pipe(concat('common.js'))//合并
        .pipe(browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe(rev())//MD5版本控制
        .pipe(gulp.dest('build/js'))//输出文件
        .pipe(rev.manifest())//生成一个rev-manifest.json
        .pipe(gulp.dest("./rev/js"));//将rev-manifest.json存放到的路径
})
gulp.task('commonjsmin', function () {
    return gulp.src('src/common/*.js')
        .pipe(uglify())//压缩
        .pipe(gulp.dest('build/common'))//输出文件
})
gulp.task('sass',function(){//执行sass编译
    return gulp.src('src/sass/*.sass')
        .pipe(sass())//sass编译
        .pipe(cleanCSS())//css压缩
        .pipe(rev())//更改版本名  加MD5后缀
        .pipe(gulp.dest('build/css'))
        .pipe(rev.manifest())//生成rev-manfest.json
        .pipe(gulp.dest('rev/css'))
})
gulp.task('htmlmin',function(){
    return gulp.src('src/html/*.html')
        .pipe(minifyHTML())//压缩html
        .pipe(gulp.dest('build/html'))
})

//文件名替换
gulp.task('htmlrev', function () {
    gulp.src(['rev/**/*.json', './src/html/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': '../css',
                'js': '../js'
            }//执行文件内css名的替换
        }))
        .pipe(gulp.dest('./build/html'));
});


gulp.task("server",function () {
    gulp.watch('src/sass/*.sass',['sass','htmlrev'])
    gulp.watch("./src/html/*.html", ["htmlmin"]);
    gulp.src('./')
        .pipe(server({
            livereload: true,
            directoryListing: true,
            //middleware: function (req, res, next) {
            //    const reqPath = url.parse(req.url).pathname;
            //    const routes = datajson.data();
            //    routes.forEach(function (i) {
            //        console.log(i.route);
            //        console.log(reqPath);
            //        if (i.route == reqPath) {
            //            i.handle(req, res, next)
            //        }
            //    });
            //    next();
            //},
            open: "src/html/defer.html"
        }));
});
