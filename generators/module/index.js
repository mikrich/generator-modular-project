'use strict';
var yeoman = require('yeoman-generator'),
    path = require('path'),
    utils = require('../util.js');


module.exports = yeoman.NamedBase.extend({
  //using NamedBase makes the name mandaotory

  setupModule: function() {

    this.formattedName = this._.camelize(this.name);

    //confirmation
    var done = this.async();
    var prompts = [
      {
        type: 'confirm',
        name: 'confirmModule',
        message: 'Please confirm \n  Module Name - ' + this.formattedName + '\n  Module Location ' + this.destinationPath()  + '/src/' + this.formattedName + '/',
        default: true
      }
    ];

    this.prompt(prompts, function (props) {
      if(props.confirmModule) {
        done();
      } else {
        this.log('module creation aborted!');
      }
    }.bind(this));

  },

  createModule: function() {
    this.sourceRoot(path.join(this.sourceRoot(), '../../templates'));

    var src = this.sourceRoot() + '/module.js',
        srcTest  = this.sourceRoot() + '/test.js'

    //create module and module definition
    yeoman.Base.prototype.template.apply(this, [
      src, 'src/' + this.formattedName + '/_' + this.formattedName + '.js'
    ]);

    //create test file
    yeoman.Base.prototype.template.apply(this, [
      srcTest, 'src/' + this.formattedName + '/unitTest/' + this.formattedName + '.spec.js'
    ]);

    try {
      utils.rewriteFile({
        file: 'index.html',
        needle: '<!-- end modules -->',
        splicable: [
          '<script src="scripts/' + this.formattedName + '.js"></script>'
        ]
      });
    }
    catch(e) {
      //this.log(e);
      this.log('error writing to index.html, ignore if creating submodule');
    }

  }

});
