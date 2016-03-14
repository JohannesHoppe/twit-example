var WebSocketServer = require('ws').Server,
    Twit = require('twit'),
    Rx = require('rx'),
    credentials = require('./credentials')

var T = new Twit(credentials);
var port = 1337;

var onConnect = function(ws) {
  console.log('** Client connected on localhost:' + port);

  var stream = T.stream('statuses/filter', {
    track: 'angularjs'
  });

  // sending tweets to the browser
  Rx.Observable
    .fromEvent(stream, 'tweet')
    .subscribe(function(tweetObject) {
      ws.send(JSON.stringify(tweetObject), function(err) {
        if (err) {
          console.log('There was an error sending the message: ', err, tweetObject);
        }
      });
  });
}

var Server = new WebSocketServer({ port: port });
Rx.Observable.fromEvent(Server, 'connection').subscribe(onConnect);
