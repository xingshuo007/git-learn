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
//更改版本名  加MD5后缀
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var minifyHTML   = require('gulp-minify-html');
gulp.task('default', function () {
    gulp.start('jsmin');
});

gulp.task('jsmin', function () {
    return gulp.src('src/js/*.js')
        //.pipe(uglify())//压缩
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
gulp.task('sass',function(){
    return gulp.src('src/sass/*.sass')
        .pipe(sass())
        .pipe(gulp.dest('build/css'))
})
gulp.task('html',function(){
    return gulp.src('src/html/*.html')
        .pipe(gulp.dest('build/html'))
})
gulp.task('cssmin', function () {
    gulp.src('src/sass/*.sass')
        .pipe(sass())//sass编译
        .pipe(cleanCSS())//css压缩
        .pipe(rev())//MD5版本控制
        .pipe(gulp.dest('./build/css'))
        .pipe(rev.manifest())//生成一个rev-manifest.json
        .pipe(gulp.dest("./rev/css"));//将rev-manifest.json存放到的路径
});
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
//gulp.task('server',function(){
//    gulp.watch('src/sass/*.sass',['sass'])
//    return gulp.src('./')
//        .pipe(server({
//            livereload:true,
//            directoryListing:true,
//            open:"src/html/index.html"
//        }));
//})
////更改版本名  加MD5后缀
//gulp.task('rev',function(){
//    return gulp.src(['src/sass/style.sass',"src/js/index.js"])
//        .pipe(rev())
//        .pipe(gulp.dest('aggregate/'))
//        .pipe(rev.manifest())
//        .pipe(gulp.dest('./'));
//
//});
//gulp.task("revCollector",function(){
//    return gulp.src(['rev-manifest.json',"src/html/index.html"])
//        .pipe(revCollector({
//            replaceReved: true,
//            dirReplacements: {
//                'css': 'aggregate',
//                'js': 'aggregate'
//            }
//        }))
//        .pipe( minifyHTML({
//            empty:true,
//            spare:true
//        }) )
//        .pipe( gulp.dest('./') );
//});

gulp.task("server",function () {
    gulp.watch("./src/css/*.sass", ["cssmin"]);
    gulp.watch("./src/html/*.html", ["html"]);
    gulp.src('./build')
        .pipe(server({
            livereload: true,
            directoryListing: true,
            middleware: function (req, res, next) {
                const reqPath = url.parse(req.url).pathname;
                const routes = datajson.data();
                routes.forEach(function (i) {
                    console.log(i.route);
                    console.log(reqPath);
                    if (i.route == reqPath) {
                        i.handle(req, res, next)
                    }
                });
                next();
            },
            open: "/html/index.html"
        }));
});
