// Default Squirrel.Windows event handler for your Electron apps from:
// https://github.com/mongodb-js/electron-squirrel-startup
// Apache License
// Version 2.0, January 2004
// http://www.apache.org/licenses/

var path = require('path');
var spawn = require('child_process').spawn;
var debug = require('debug')('electron-squirrel-startup');
var app = require('electron').app;

var run = function(args, done) {
  var updateExe = path.resolve(path.dirname(process.execPath), '..', 'Update.exe');
  debug('Spawning `%s` with args `%s`', updateExe, args);
  spawn(updateExe, args, {
    detached: true
  }).on('close', done);
};

var check = function() {
  if (process.platform === 'win32') {
    var cmd = process.argv[1];
    debug('processing squirrel command `%s`', cmd);
    var target = path.basename(process.execPath);

    if (cmd === '--squirrel-install' || cmd === '--squirrel-updated') {
      // app.setAsDefaultProtocolClient('magnet')
      run(['--createShortcut=' + target + ''], app.quit);
      return true;
    }
    if (cmd === '--squirrel-uninstall') {
      app.removeAsDefaultProtocolClient('magnet')
      run(['--removeShortcut=' + target + ''], app.quit);
      return true;
    }
    if (cmd === '--squirrel-obsolete') {
      app.removeAsDefaultProtocolClient('magnet')
      app.quit();
      return true;
    }
  }
  return false;
};

module.exports = check();
