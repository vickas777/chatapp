'use strict';

var config = require('meanio').loadConfig(),
  cookie = require('cookie'),
  cookieParser = require('cookie-parser'),
  socketio = require('socket.io');

module.exports = function(http) {

  var io = socketio.listen(http);

  io.on('connection', function(socket) {
    
    socket.on('message', function(text, cb){
      socket.broadcast.emit('message', text);
      cb();
    });
  });

  io.use(function(socket, next) {
    var data = socket.request;

    if (!data.headers.cookie) {
      return next(new Error('No cookie transmitted.'));
    }

    var parsedCookie = cookie.parse(data.headers.cookie);
    var sessionID = parsedCookie[config.sessionName];
    var parsedSessionID = cookieParser.signedCookie(parsedCookie[config.sessionName], config.sessionSecret);

    if (sessionID === parsedSessionID) {
      return next(new Error('Cookie is invalid.'));
    }

    next();
  });

  return io;
};