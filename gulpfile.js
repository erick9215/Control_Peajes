var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    plumber = require('gulp-plumber'),
    shell = require('gulp-shell'),
    argv = require('yargs').argv;


gulp.task('server', function(){
    var action, parameters;

    if (argv.start !== undefined || argv.stop !== undefined) {
        action = (argv.start !== undefined) ? 'start' : 'stop';
        parameters = (argv.start !== undefined) ? './Application/public/ -p 8090 -c-1 -d false -o' : '';
        return gulp.src('').pipe(shell('"./node_modules/.bin/forever" '+action+' "./node_modules/http-server/bin/http-server" '+parameters));
    }else{
        console.log('**Invalid action \nPlease use  gulp server (--start\|--stop)');
    }
});

gulp.task('bower', shell.task([
    'node "./node_modules/bower/bin/bower" install'
]));

gulp.task('default', ['build']);

