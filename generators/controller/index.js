'use strict';
var yeoman = require('yeoman-generator'),
    path = require('path')

module.exports = yeoman.NamedBase.extend({


  setupController: function() {

    this.moduleName = process.cwd().split(path.sep).pop();
    this.formattedName = this._.classify(this.name);

    // if the controller name is suffixed with ctrl, remove the suffix
    // if the controller name is just "ctrl," don't append/remove "ctrl"
    if (this.formattedName && this.formattedName.toLowerCase() !== 'ctrl' && this.formattedName.substr(-4).toLowerCase() === 'ctrl') {
      this.formattedName = this.formattedName.slice(0, -4);
    }

    //confirmation
    var done = this.async();
    var prompts = [
      {
        type: 'confirm',
        name: 'confirmController',
        message: 'Please confirm \n  Controller Name - ' + this.formattedName + '\n  Controller Location - ' + process.cwd(),
        default: true
      },
      {
        type: 'input',
        name: 'parentModuleName',
        message: 'Enter / confirm Parent module name',
        default: this.moduleName
      }
    ];

    this.prompt(prompts, function (props) {
      if(props.confirmController) {
        //update module name with changes........
        this.moduleName = props.parentModuleName;
        done();
      } else {
        this.log('controller creation aborted!');
      }
    }.bind(this));

  },

  createController: function() {
    this.sourceRoot(path.join(this.sourceRoot(), '../../templates'));

    var src = this.sourceRoot() + '/controller.js',
        srcTest  = this.sourceRoot() + '/test.js';

    yeoman.generators.Base.prototype.template.apply(this, [
      src, this.formattedName + '.js'
    ]);

    //create test file
    yeoman.generators.Base.prototype.template.apply(this, [
      srcTest, 'unitTest/' + this.formattedName + '.spec.js'
    ]);
  }

});
