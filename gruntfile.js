module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			src: {
				files: ['*.html', 'src/**'],
				tasks: ['compass', 'concat', 'copy', 'autoprefixer'],
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
				src: [
					'src/js/modernizr.js',
					'src/js/srcset-polyfill.js',
					'src/js/helpers.js',
					'src/js/animatedSprite.js',
					'src/js/header-background.js',
					'src/js/header-animation.js',
					'src/js/skrollr-stylesheet.js',
					'src/js/skrollr.js',
					'src/js/page-flow.js'
				],
				dest: 'dist/scripts.js'
			}
		},
		copy: {
			dist: {
				files: [
					{ src: ['src/index.html'], dest: 'dist/index.html'},
					{ expand:true, cwd: 'src', src: ['./images/**/*'], dest: 'dist/'},
					{ expand:true,  cwd: 'src', src: ['./fonts/**/*'], dest: 'dist/'},
					{ src: ['src/css/skrollr.css'], dest: 'dist/skrollr.css'}
				]
			}
		},
		autoprefixer: {
			dist:{
				expand: true,
				src: 'dist/style.css'
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
  grunt.loadNpmTasks('grunt-autoprefixer');
  
  grunt.registerTask('build', ['compass', 'concat', 'copy', 'autoprefixer']);

  grunt.registerTask('serve', "Serve your app", ['connect:server', 'watch' ]);
};