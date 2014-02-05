module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*!\n' +
            ' * <%= pkg.title || pkg.name %>\n' +
            ' * Version: <%= pkg.version %>\n' +
            ' * Build Date: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: ['src/intro.js', 'src/enums.js', 'src/*.js'],
                dest: '<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    '<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        copy: {
            demo: {
                files: [
                    {
                        src: ['<%= concat.dist.dest %>', '<%= pkg.name %>.min.js'],
                        dest: 'demo/js/'
                    },
                    {
                        src: ['css/**'],
                        dest: 'demo/'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['concat', 'uglify', 'copy']);
};