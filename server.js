const http  = require('http');
var express = require('express');
var app     = express();
var crypto  = require('crypto');

var polls   = {};

app.use(express.static('public'));

app.get('/', function (request, response){
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/admin/:id', (request, response) => {
  response.sendFile(__dirname + '/public/admin.html')
});

var port   = process.env.PORT || 3000;
var server = http.createServer(app).listen(port, function () {
  console.log('Listening on port ' + port + '.');
});

const socketIo = require('socket.io');
const io       = socketIo(server);

io.on('connection', function(socket) {

  socket.on('message', function (channel, message) {
    var adminString = 'poll-'  + randomString();
    var voterString = 'voter-' + randomString();

    if (channel === 'pollCreated') {
      polls[adminString] = {
        voterString: voterString,
        poll: message
      }
      socket.emit('urls', { admin: adminString, voter: voterString });

      // TODO: want to redirect back to the new admin url to show the poll,
      // or have a button to view results
    }
  });
});

function randomString() {
  return crypto.randomBytes(10).toString('hex');
}


module.exports = server;
