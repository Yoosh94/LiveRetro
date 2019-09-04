var express = require('express');
var path = require('path');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var RoomGenerator = require('./RoomGenerator')
var currentRooms = [];
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req,res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('createRoom',function(){
        console.log("Creating a room")
        var roomCode = RoomGenerator.Generate();
        console.log(roomCode);
        currentRooms.push(roomCode);
        socket.emit('roomCreated',roomCode);
    });

    socket.on('joinRoom',(roomCode)=>{
        const doesRoomExist = currentRooms.includes(roomCode);
        if(doesRoomExist){
            socket.emit('joinRoomSuccess',roomCode);
        }else{
            socket.emit('joinRoomFailed');
        }
    })


  });


const port = process.env.PORT || 5000;
http.listen(port);

console.log('App is listening on port ' + port);