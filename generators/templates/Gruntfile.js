
'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    copy: {
      config: {
        dot: true,
        expand: true,
        cwd: 'node_modules/grunt-modular-project/config/',
        src: ['**'],
        dest: 'config/'
      }
    }
  });
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('setup', ['copy:config']);
};
