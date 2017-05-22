var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    plumber = require('gulp-plumber'),
    merge = require('merge-stream'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    shell = require('gulp-shell'),
    argv = require('yargs').argv,
    gulpNgConfig = require('gulp-ng-config'),

    // Paths
    srcPath = 'application/',
    bowerPath = 'bower_components/',
    vendorPath = srcPath + 'js/vendor/',
    destPath = 'public/',
    constantsPath = srcPath + 'config/constants.json',

    // Configuration
    isProductionBuild = false;

gulp.task('constants', function () {
    var environment = 'prod';

    if (argv.local !== undefined) {
        environment = 'local';
    } else if (argv.dev !== undefined) {
        environment = 'dev';
    } else if (argv.qa !== undefined) {
        environment = 'qa';
    } 

    gulp.src(constantsPath)
    .pipe(gulpNgConfig('myApp.config', {environment:environment}))
    .pipe(gulp.dest(srcPath + 'scripts/'));
});

gulp.task('prodValidation', function () {
    if (argv.local === undefined && argv.dev === undefined) {
        isProductionBuild = true;
    }
});

gulp.task('server', function(){
    var action, parameters;

    if (argv.start !== undefined || argv.stop !== undefined) {
        action = (argv.start !== undefined) ? 'start' : 'stop';
        parameters = (argv.start !== undefined) ? './ -p 8090 -c-1 -d false' : '';
        return gulp.src('').pipe(shell('"./node_modules/.bin/forever" '+action+' "./node_modules/http-server/bin/http-server" '+parameters));
    }else{
        console.log('**Invalid action \nPlease use  gulp server (--start\|--stop)');
    }
});

gulp.task('bower', shell.task([
    'node "./node_modules/bower/bin/bower" install'
]));

gulp.task('css', function () {
    return gulp.src([srcPath + 'scss/styles.scss'])
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulpif(isProductionBuild, cssmin()))
        .pipe(gulp.dest(destPath + 'css'));
});

gulp.task('css-base', function () {
    return gulp.src([
            srcPath + 'scss/vendor/*.css'
        ])
        .pipe(plumber())
        .pipe(gulpif(isProductionBuild, cssmin()))
        .pipe(gulp.dest(destPath + 'css'));
});

gulp.task('css-libraries', function () {
    return gulp.src([
            /* Core Angular Modules */
            bowerPath + 'angular/angular-csp.css',

            /* Animations */
            bowerPath + 'animate.css/animate.css',

            /* Material */
            bowerPath + 'material-design-iconic-font/dist/css/material-design-iconic-font.css',
            //bowerPath + 'waves/dist/waves.css', // Included in Material Admin Theme

            /* UI Components */
            //bowerPath + 'jasny-bootstrap/jasny-bootstrap.css', // Included in Material Admin Theme
            bowerPath + 'bootstrap-sweetalert/lib/sweet-alert.css',
            bowerPath + 'angular-loading-bar/src/loading-bar.css',
            bowerPath + 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.css',
            bowerPath + 'nouislider/jquery.nouislider.css',
            vendorPath + 'chosen/chosen.css',
            bowerPath + 'lightgallery/dist/css/lightgallery.css'
        ])
        .pipe(plumber())
        .pipe(concat('libraries.css'))
        .pipe(gulpif(isProductionBuild, cssmin()))
        .pipe(gulp.dest(destPath + 'css'));
});

/*
@import 'vendors/bower_components/material-shadows/material-shadows';
*/

gulp.task('js', function () {
    return gulp.src([srcPath + 'scripts/app.js', srcPath + 'scripts/**/*.module.js', srcPath + 'scripts/**/*.js', '!' + srcPath + 'scripts/vendor/**/*.js'], { base: srcPath })
        .pipe(plumber())
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(gulpif(isProductionBuild, uglify()))
        .pipe(gulp.dest(destPath + 'js'));
});

gulp.task('js-base', function () {
    return gulp.src([
            bowerPath + 'jquery/dist/jquery.js',
            bowerPath + 'angular/angular.js',
            srcPath + 'js/vendor/material-admin-theme.js'
        ])
        .pipe(plumber())
        .pipe(gulpif(isProductionBuild, uglify()))
        .pipe(gulp.dest(destPath + 'js'));
});

gulp.task('js-libraries', function () {
    return gulp.src([
            /* Core Angular Modules */
            bowerPath + 'angular-animate/angular-animate.js',
            bowerPath + 'angular-aria/angular-aria.js',
            bowerPath + 'angular-cookies/angular-cookies.js',
            bowerPath + 'angular-resource/angular-resource.js',
            bowerPath + 'angular-messages/angular-messages.js',
            bowerPath + 'angular-touch/angular-touch.js',

            /* Angular Plugins */
            bowerPath + 'angular-ui-router/release/angular-ui-router.js', // Single Page Application Router. Required (do not remove)
            bowerPath + 'angular-loading-bar/src/loading-bar.js', // Top Loading Bar. Required (do not remove)
            bowerPath + 'nouislider/Link.js', // Slider Library Required Dependency
            bowerPath + 'nouislider/jquery.nouislider.js', // Slider Library
            bowerPath + 'angular-nouislider/src/nouislider.js', // Angular Slider Implementation
            vendorPath + 'chosen/chosen.jquery.js', // Chosen Dropdown Library
            bowerPath + 'angular-bootstrap/ui-bootstrap-tpls.js', // Angular UI Bootstrap Library
            bowerPath + 'ng-table/dist/ng-table.js', // Advanced HTML tables for AngularJS

            /* Common Vendors - Core Libraries */
            bowerPath + 'lodash/dist/lodash.js', // Lodash Collection Processing
            bowerPath + 'moment/moment.js', // MomentJS time formatting library
            bowerPath + 'moment-timezone/moment-timezone.js', // MomentJS timezones support

            /* Common Vendors - UI Libraries */
            bowerPath + 'jasny-bootstrap/dist/js/jasny-bootstrap.js', // File Input
            bowerPath + 'malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
            bowerPath + 'bootstrap-sweetalert/lib/sweet-alert.js', // For Alert Modals
            bowerPath + 'waves/dist/waves.js', // Required (do not remove)
            bowerPath + 'bootstrap-growl/index.js', // For notifications
            bowerPath + 'autosize/dist/autosize.js', // To automatically resize text areas
            bowerPath + 'jquery-mask-plugin/dist/jquery.mask.js', // To mask input controls
            bowerPath + 'lightgallery/dist/lightgallery.js', // For lightbox galleries

            /* Common Vendors - Chart Libraries */
            bowerPath + 'flot/jquery.flot.js', // Flot chart library and dependencies
            bowerPath + 'flot/jquery.flot.resize.js',
            bowerPath + 'flot/jquery.flot.stack.js',
            bowerPath + 'flot/jquery.flot.time.js',
            bowerPath + 'flot/jquery.flot.pie.js',
            bowerPath + 'flot-orderBars/index.js',
            bowerPath + 'angular-flot/angular-flot.js',
            bowerPath + 'flot.curvedlines/curvedLines.js',
            bowerPath + 'flot.tooltip/js/jquery.flot.tooltip.js',
            bowerPath + 'sparkline/index.js', // Sparkline chart library
            bowerPath + 'jquery.easy-pie-chart/dist/angular.easypiechart.js' // Easy Pie Chart library

        ])
        .pipe(plumber())
        .pipe(concat('libraries.js'))
        .pipe(gulpif(isProductionBuild, uglify()))
        .pipe(gulp.dest(destPath + 'js'));
});

gulp.task('fonts', function () {
    return gulp.src([
            bowerPath + 'material-design-iconic-font/dist/fonts/*'
        ])
        .pipe(plumber())
        .pipe(gulp.dest(destPath + 'fonts'));
});

gulp.task('images', function () {
    return gulp.src([
            vendorPath + 'lightgallery/dist/img/*'
        ])
        .pipe(plumber())
        .pipe(gulp.dest(destPath + 'img'));
});

gulp.task('build', ['prodValidation', 'css', 'css-base', 'css-libraries', 'js-base', 'js-libraries', 'js', 'fonts', 'images', 'constants']);

gulp.task('build:copy', ['build'], function () {
    var util = require('gulp-util');

    if (util.env.webapp) {
        return gulp.src(destPath + '**/*', { basedir: destPath })
            .pipe(plumber())
            .pipe(gulp.dest(util.env.webapp));
    }
});

gulp.task('build:copy:watch', ['build:copy'], function () {
    gulp.watch([
        srcPath + '**/*',
        destPath + '**/*',
        '!' + destPath + 'css/**/*',
        '!' + destPath + 'js/**/*'
    ], ['build:copy']);
});

gulp.task('default', ['build']);


