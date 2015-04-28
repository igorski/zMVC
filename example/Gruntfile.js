module.exports = function( grunt )
{
    grunt.initConfig(
    {
        // copies resource files to temporary dist folder
        copy : {
            dev : {
                files : [
                    {
                        expand : true,
                        cwd    : "resources/",
                        src    : [ "**/*" ],
                        dest   : "dist/"
                    }
                ]
            }
        },
        // resolves the commonJS dependencies for usage in the browser
        browserify : {
            dev : {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                files: {
                    'dist/app.js' : [ 'src/**/*.js' ]
                }
            }
        },
        // synchronized the browser to refresh when changing source files
        browserSync :
        {
            bsFiles: {
            src: [
                    'dist/**/*'
                 ]
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: 'dist/',
                    index: 'index.html'
                }
            }
        },
        // watches changes to the source code for running the browserify task automatically
        watch : {
            scripts : {
                files: "src/**/*.js",
                tasks: [ "browserify" ]
            },
            resources : {
                files: "resources/**/*",
                tasks: [ "copy" ]
            }
        }
    });

    grunt.loadNpmTasks( "grunt-browserify" );
    grunt.loadNpmTasks( "grunt-contrib-copy" );
    grunt.loadNpmTasks( "grunt-browser-sync" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );

    grunt.registerTask( "start", function()
    {
        grunt.task.run( "copy" );
        grunt.task.run( "browserify" );
        grunt.task.run( "browserSync" );
        grunt.task.run( "watch" );
    });
};
