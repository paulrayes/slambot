module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			css: {
				files: [
					{
						expand: true,
						cwd: 'public/less',
						src: '**/*.css',
						dest: 'public/css'
					}
				]
			}
		},
		less: {
			// Compiles LESS to CSS for dev environment
			dev: {
				options: {
					paths: ['public/less'],
					relativeUrls: true
				},
				files: [
					{
						expand: true,
						cwd: 'public/less',
						src: '**/*.less',
						dest: 'public/css',
						ext: '.css'
					}
				]
			}
		},

		// Ensures node is kept running, and restarts it when fiels change
		supervisor: {
			target: {
				script: 'app.js',
				options: {
					debug: true,
					forceSync: true,
					ignore: ['public']
				}
			}
		},

		// Watches for front-end files to change
		watch: {
			scripts: {
				files: ['public/js/**'],
				options: {
					livereload: 35728
				}
			},
			styles: {
				files: ['public/less/**'],
				tasks: ['copy:css', 'less:dev'],
				options: {
					livereload: 35728
				}
			},
			partials: {
				files: ['public/partials/**'],
				options: {
					livereload: 35728
				}
			}
		}
	});


	grunt.registerTask('dev', [
		//'copy:css',
		//'less:dev',
		'supervisor',
		//'watch'
	]);

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-supervisor');

	grunt.registerTask('default', ['dev']);
};