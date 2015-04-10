module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            default: {
                options: {
                    jshintrc: './.jshintrc'
                },
                src: ['src/**/*.js', 'test/*.js', 'example/*.js']
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>@<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('mocha-phantomjs', 'mocha phantomjs tests.', function () {
        var done = this.async();
        require('child_process').exec('mocha-phantomjs test/TestRunner.html', function (error, stdout, stderr) {
            if (error) {
                grunt.log.error(stdout);
                grunt.fail.warn(error);
            }
            else {
                grunt.log.ok(stdout);
            }
            done();
        });
    });
    grunt.registerTask('test', ['jshint', 'mocha-phantomjs']);
    grunt.registerTask('build', ['uglify']);

    // Default task(s).
    grunt.registerTask('default', ['test', 'build']);

};