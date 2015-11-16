module.exports = function(grunt) {
	grunt.initConfig({
		watch: {
			options: {
				livereload: true
			},
			run: {
				files: ['public/**']
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-watch");

	//grunt.registerTask("watch");
}
