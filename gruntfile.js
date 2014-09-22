module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			src: {
				files: ['*.html', 'src/**'],
				tasks: ['compass', 'concat', 'copy'],
				options: { livereload: true }
			}
		},
		compass: {
			dist: {
				options: {
					sassDir: 'src/css',
					cssDir: 'dist'
				}
			}
		},
		concat: {
			dist: {
				src: ['src/js/modernizr.js', 'src/js/srcset-polyfill.js', 'src/js/helpers.js',
					'src/js/animatedSprite.js', 'src/js/header-background.js', 'src/js/header-animation.js',
					'src/js/skrollr-stylesheet.js', 'src/js/skrollr.js', 
					'src/js/page-flow.js'],
				dest: 'dist/scripts.js'
			}
		},
		copy: {
			dist: {
				files: [
					{ src: ['index.html'], dest: 'dist/index.html'},
					{ src: ['images/**'], dest: 'dist/'},
					{ src: ['fonts/**'], dest: 'dist/'},
					{ src: ['src/css/skrollr.css'], dest: 'dist/skrollr.css'}
				]
			}
		},
		connect: {
			server: {
				options: {
					port: 9001,
					base: 'dist'
				}
			}
		}
	});

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('server', "Serve your app", ['connect:server', 'watch' ]);
}

