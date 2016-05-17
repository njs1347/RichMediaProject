var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var path = require('path');
var express = require('express');
var compression = require('compression');
var cookieParser =  require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var url = require('url');


var dbURL = process.env.MONGODB_URI || "mongodb://localhost/RichMediaProject";


var db = mongoose.connect(dbURL, function(err){
   if(err){
       console.log("Could not connect to the database");
       throw err;
   } 
});

var redisURL ={
    hostname: 'localhost',
    port: 6379   
};

var redisPASS;

if(process.env.REDISCLOUD_URL){
    redisURL = url.parse(process.env.REDISCLOUD_URL);
    redisPASS = redisURL.auth.split(":")[1];
}

var router = require("./router.js");

var port = process.env.PORT || process.env.NODE_PORT || 3000;

var app = express();
app.use('/assets', express.static(path.resolve(__dirname+'/../client/')));
app.use(compression());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(session({
    store: new RedisStore({
        host: redisURL.hostname,
        port: redisURL.port,
        pass: redisPASS
    }),
    secret: 'Thank You',
    resave: true,
    saveUninitialized: true,
    cookie:{
        httpOnly: true
    }
}));


app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.disable('x-powered-by');
app.use(cookieParser());

router(app);




//read the client html file into memory
//__dirname in node is the current directory
//in this case the same folder as the server js file
/*
var index = fs.readFileSync(__dirname + '/views/app.jade');
		
function onRequest(request, response) {
    //var fn = jade.compile(str, { filename: '/views/app.jade', pretty: true});
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(index);
	response.end();
    
}

var server = http.createServer(app).listen(port);*/


var server = app.listen(port, function(err){
    
   if(err){
       throw err;
   }
    console.log('Listening on port ' + port);
});

//console.log("Listening on 127.0.0.1:" + port);

//pass in the http server into socketio and grab the websocket server as io
var io = socketio(server);

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
        
        var joinMsg={
           name: 'server',
           msg: 'There are ' + Object.keys(users).length + ' users online'
       };
        
        io.sockets.in(data.room).emit('msg', joinMsg);
        
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
        
        
        socket.emit('msg', {
          name: 'server',
          msg: 'You joined the room'     
       });
  });
}



var onMsg = function(socket){
    socket.on('msgToServer', function(data){
       io.sockets.in(data.room).emit('msg',{
           name: socket.name,
           msg: data.msg    
         });           

    });
       
};


function onDraw(socket) {

	socket.on("drawsToServer", function (data) 
	{
		var room = rooms[users[socket.name]];
		room.draws[data.self] = data.draws;
        //console.log(room.draws[data.self]);
		io.sockets.in(users[socket.name]).emit('drawline', {
		self: data.self,
		draws: room.draws[data.self]
    });
  });
}

function onDisconnect(socket){
	socket.on('disconnect', function(){
		socket.broadcast.to(rooms).emit('msg',{
          name: 'server',
          msg: socket.name + " has left the room." 
       });
	   delete users[socket.name];
		console.log(socket.name + " Disconnected");
	});
}

io.sockets.on('connection', function(socket){
	console.log("New Connection");
	onDraw(socket);
	onDisconnect(socket);
	onJoin(socket);
    onMsg(socket);
	
	//socket.join('room1');
});



