var express = require('express');
var logfmt = require('logfmt');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var messageQueue = [];

app.use(logfmt.requestLogger());

app.get('/sms', function(req, res) {
  res.set('Content-Type', 'text/xml');
  res.send('<?xml version="1.0" encoding="UTF-8"?>\
<Response><Message>Received ' + req.param('From') + ' ' + req.param('Body') + '</Message></Response>');
});

var port = Number(process.env.PORT || 5000);
server.listen(port, function() {
  console.log("Listening on " + port);
});
