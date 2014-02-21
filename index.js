var path = require('path');
var fs = require('fs');
var glob = require('glob');
var _ = require('lodash');
var lineReader = require('line-reader');
var q = require('q');
var DepGraph = require('dependency-graph').DepGraph;

var referencePattern = /@reference (.+)/

var createReference = function(config, logger, emitter, fileList) {
  var basePath = config.basePath;
  var configFiles = config.files;
  var log = logger.create('karma-reference');
  // helpers
  function createFileList(){
    var list = [];
    var promises = _.map(configFiles, function(entry){
      var defered = q.defer();
      glob(entry.pattern, function(er, files){
        _.each(files, function(filename){
          var fileItem = _.extend({}, entry, {pattern: path.normalize(filename)});
          list.push(fileItem);
        });
        defered.resolve();
      }); 
      return defered.promise;
    });
    return q.all(promises).then(function() {
      return list;
    })
  }
  function shouldScanFile(filename){
    var ext = path.extname(filename);
    return ext == '.coffee' || ext == '.js';
  };
  function findReferences(filename){
    var fileBasePath = path.dirname(filename);
    var defered = q.defer();
    var references = [];
    function normalizePath(filePath){
      if (filePath[0] == '~'){
        return path.join(basePath, filePath.substr(1))
      }
      return path.join(fileBasePath, filePath);
    }
    lineReader.eachLine(filename, function(line, last){
      var match = referencePattern.exec(line);
      if (match){
        _.each(match[1].split(/\s+/), function(ref){
          references.push(normalizePath(ref));
        });
      };
    })
    .then(function() {
      defered.resolve(references);
    });
    return defered.promise;
  }
  // init promise
  var referencesInited = createFileList().then(function(list){
    var depsGraph = new DepGraph();
    var fileMap = {};
    _.each(list, function(file){
      depsGraph.addNode(file.pattern);
      fileMap[file.pattern] = file;
    });
    var promises = _.map(list, function(file, index){
      var filename = file.pattern;
      return findReferences(filename).then(function(deps){
        if (deps.length > 0) {
          _.each(deps, function(dep){
            if (fileMap[dep]){
              depsGraph.addDependency(filename, dep);   
            }
            else {
              log.warn('unknown dep: ' + dep + " for filename: " + filename)
            }
          });
        };
      });
    });
    return q.all(promises).then(function(){
      var flatDeps = depsGraph.overallOrder();
      return _.map(flatDeps, function(filename){
        return fileMap[filename];
      });
    });
  })
  .then(function(result){
    config.files = result;
    return fileList.reload(config.files, config.exclude);
  });
  //dirty hack on emitter, we should monkey patch emit on 'file_list_modified' 
  var originalEmit = emitter.emit;
  emitter.emit = function(e, promise){
    if (e == 'file_list_modified'){
      promise = referencesInited;
      originalEmit.call(emitter, e, promise);
      emitter.emit = originalEmit;
    }
    originalEmit.apply(emitter, arguments);
  }
};
createReference.$inject = ['config', 'logger', 'emitter', 'fileList'];

module.exports = {
  'framework:reference': ['factory', createReference]
};