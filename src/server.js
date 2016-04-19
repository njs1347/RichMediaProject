var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');

var port = process.env.PORT || process.env.NODE_PORT || 3000;

//read the client html file into memory
//__dirname in node is the current directory
//in this case the same folder as the server js file
var index = fs.readFileSync(__dirname + '/../client/client.html');
		
function onRequest(request, response) {

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(index);
	response.end();
}

var app = http.createServer(onRequest).listen(port);

console.log("Listening on 127.0.0.1:" + port);

//pass in the http server into socketio and grab the websocket server as io
var io = socketio(app);

//object to hold all of our connected users
var users = {};
var rooms = {};

function onJoin(socket){
	
	socket.on("join", function (data) 
	{
    if (!rooms[data.room]) {
      rooms[data.room] = {
        users: [],
        draws: {}
      };
    }
		socket.name = data.name;
		rooms[data.room].users[socket.name] = socket.name;
		users[socket.name] = data.room;
		console.log(rooms);
		socket.join(data.room);
		if (Object.keys(rooms[data.room].draws).length > 0) {
		io.sockets.in(data.room).emit('drawCurrent', {
			draws: rooms[data.room].draws
      });
    }
  });
}

function onDraw(socket) {

	socket.on("drawsToServer", function (data) 
	{
		var room = rooms[users[socket.name]];
		room.draws[data.self] = data.draws;
		io.sockets.in(users[socket.name]).emit('drawline', {
		self: data.self,
		draws: room.draws[data.self]
    });
  });
}

function onDisconnect(socket){
	socket.on('disconnect', function(){
		
	
		console.log("User Disconnected");
	});
}

io.sockets.on('connection', function(socket){
	console.log("New Connection");
	onDraw(socket);
	onDisconnect(socket);
	onJoin(socket);
	
	//socket.join('room1');
});