module.exports = function(grunt) {

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
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        mocha_require_phantom: {
            options: {
                base: 'test',
                main: 'main.js',
                requireLib: 'libs/require.js',
                files: [
                    'viewManagerTest.js',
                    // './**/*.js'
                ],
            },
            target: {
            },
        },
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-require-phantom');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'mocha_require_phantom', 'uglify']);
};