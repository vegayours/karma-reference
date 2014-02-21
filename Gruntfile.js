module.exports = function(grunt){
  grunt.initConfig({
    'pkgFile': 'package.json',
    'publish': {
      abortIfDirty: true
    }
  });
  grunt.loadNpmTasks('grunt-npm');
  grunt.registerTask('default', ['publish']);
}