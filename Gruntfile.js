module.exports = function(grunt){
  grunt.initConfig({
    pkgFile: 'package.json',
    publish: {
      abortIfDirty: true
    },
    bump: {
      options: {
        pushTo: 'origin'
      }
    }
  });
  grunt.loadNpmTasks('grunt-npm');
  grunt.loadNpmTasks('grunt-bump');
  grunt.registerTask('release', function(type){
    grunt.task.run([
      "bump:" + type || 'patch',
      "publish"
    ]);
  });
}