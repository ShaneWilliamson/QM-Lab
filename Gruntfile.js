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
      all: {
      	options: {
      		urls: [
      			'http://test.local/src/Unit_Tests/unitTest.html'
      		],
      		page: {
      			settings: {
      				resourceTimeout:10000,
      				//userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3',
      				loadImages:false,
      				localToRemoteUrlAccessEnabled:true,
      			}
      		}
      	}
      }
    }

  });
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.registerTask('default', ['qunit']);
};
