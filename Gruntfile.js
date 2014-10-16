'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.name %> - <%= pkg.description %>\n' +
					' * @link <%= pkg.homepage %>\n' +
					' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
					' * @version <%= pkg.version %>\n' +
					' * @license The MIT License.\n' +
					' * @copyright Copyright (C) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
					' * @builddate <%= grunt.template.today("yyyy-mm-dd") %>\n' +
					' */\n'
			},
			sprintly_api: {
				src: [
					'src/sprintly_api.js',
					'src/sprintly_api/*.js',
					'src/sprintly_api/**/*.js'
				],
				dest: 'lib/sprintly.js',
			}
		},
		watch: {
			sprintly_api: {
				files: [
					'src/sprintly_api.js',
					'src/sprintly_api/*.js',
					'src/sprintly_api/**/*.js'
				],
				tasks: ['js-sprintly-api'],
				options: {
					spawn: false
				}
			}
		},
		uglify: {
			sprintly_api: {
				src: [
					'src/sprintly_api.js',
					'src/sprintly_api/*.js',
					'src/sprintly_api/**/*.js'
				],
				dest: 'lib/sprintly.min.js'
			}
		},
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			sprintly_api: ['src/sprintly_api/*.js', 'src/sprintly_api/**/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('js-sprintly-api', ['jshint:sprintly_api', 'concat:sprintly_api', 'uglify:sprintly_api']);
	grunt.registerTask('js', ['js-sprintly-api']);
	grunt.registerTask('default', ['js']);
};
