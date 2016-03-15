module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),


    jshint: {
      files: [
        'Gruntfile.js',
        'src/Main/*.js',
        'src/Unit_Tests/tests.js',
        '!src/Main/webix.js',
        '!src/Main/backbone.js',
        '!src/Main/joint.js',
        '!src/Main/jquery.js',
        '!src/Main/lodash.js'
      ],
      options: {
        jshintrc: '.jshintrc',
        globals: {
          jQuery: true
        }
      }
    },


    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
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
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('syntax',['jshint'])
  grunt.registerTask('test', ['qunit']);
	grunt.registerTask('default', ['jshint', 'qunit']);
};
