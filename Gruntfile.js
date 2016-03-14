module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    qunit: {
      options: {
      	'--ignore-ssl-errors':true,
      	'--max-disk-cache-size':100000,
      	'--load-images':false,
      	'--local-to-remote-url-access':true,
      	'--ssl-protocol':'any',
        '--cookies-file':'cookies.txt'
      },
      all: ['src/Unit_Tests/*.html']

    }

  });
	grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.registerTask('test', ['qunit']);
	grunt.registerTask('default', ['qunit']);
};
