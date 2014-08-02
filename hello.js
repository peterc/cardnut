var express = require('express');
var logfmt = require('logfmt');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var events = require('events');
var eventEmitter = new events.EventEmitter();

// Express middleware
app.use(logfmt.requestLogger());
app.use(express.static('public'));

// Stores messages waiting to go out over WebSocket
// var messageQueue = [];

// Process an SMS coming in
app.get('/sms', function(req, res) {
  var message = {};
  message.from = req.param('From');
  message.body = req.param('Body');

  var digits = message.body.match(/(\d+)(\,|\s)(\d+)/);
  if (digits) {
    message.card1 = digits[1];
    message.card2 = digits[3];
  }

  //messageQueue.push(message);
  eventEmitter.emit('message', message);

  res.set('Content-Type', 'text/xml');
  res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
});


// WebSocket stuff
io.on('connection', function(socket) {

  eventEmitter.on('message', function(message) {
    socket.emit('message', message );
  });

  console.log('connection!');
  socket.on('event', function(data) {});
  socket.on('disconnect', function() {});
});


// Start server
var port = Number(process.env.PORT || 5000);
server.listen(port, function() {
  console.log("Listening on " + port);
});
