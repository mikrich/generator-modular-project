'use strict';
var yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    yosay = require('yosay'),
    path = require('path'),
    request = require('request'),
    json = require('json-update');


module.exports = yeoman.Base.extend({

  paths: function() {
    this.sourceRoot(path.join(this.sourceRoot(), '../../templates'));
  },

  initializing: function () {

    var done = this.async();

    request('https://raw.githubusercontent.com/uglow/grunt-modular-project/master/package.json', function(error, response, body) {
      //error handling needs to happen here
      var data = JSON.parse(body);
      this.devDependencies = data.devDependencies;
      done();
    }.bind(this));

    this.pkg = require('../../package.json');
  },

  prompting: function () {
    var done = this.async();
    this.log(yosay(
      'Welcome to the top-notch ' + chalk.green('Modular Angular') + ' generator!'
    ));

    var prompts = [
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname
      }
    ];

    this.prompt(prompts, function (props) {
      this.appname = props.projectName;
      done();
    }.bind(this));

  },

  configuring: function() {
    //save user config
    //this generates .yo-rc.json which is used for identifying root.
    //this.config.save();
    //is causing problems..

    //perform config related tasks here...
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
    this.fs.copy(
      this.templatePath('jshintrc'),
      this.destinationPath('.jshintrc')
    );
  },

  writing: {
    app: function () {
      //does this app method need to be here?
      this.fs.copy(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
      );

      //copy templates call in custom values
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        { title: this.appname  }
      );

      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        { title: this.appname  }
      );

      this.fs.copyTpl(
        this.templatePath('index.html'),
        this.destinationPath('index.html'),
        { title: 'base template for ' + this.appname  }
      );

    }

  },

  install: function () {
    //update json with dependencies from the grunt-modular-project
    this.devDependencies["grunt-modular-project"] = "^0.4.0";

    json.update('package.json', { devDependencies: this.devDependencies }, function(err, obj) {
      if (typeof err !== "" && err !== null) {
        this.log("Error updating json: " + err.message);
      }
    }.bind(this));

    this.installDependencies({
      skipInstall: this.options['skip-install'],

      //run the grunt setup task on completion
      callback: function () {
        this.spawnCommand('grunt', ['setup']);
      }.bind(this)
    });

  }

});
