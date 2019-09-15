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

    socket.on('createRoom',function(name){
        console.log("Creating a room")
        var roomCode = RoomGenerator.Generate();
        var room = RoomGenerator.Room();
        room.roomCode = roomCode;
        room.participants.push(name);
        console.log(roomCode);
        currentRooms.push(room);
        console.log(currentRooms);
        socket.emit('roomCreated',roomCode);
    });

    socket.on('joinRoom',(roomCode,participantName)=>{

        const roomToEnter = currentRooms.filter(roomObject =>{
           return roomObject.roomCode === roomCode
        });

        if(roomToEnter.length === 1){
            roomToEnter[0].participants.push(participantName);
            socket.emit('joinRoomSuccess',roomCode)
        }else{
            socket.emit('joinRoomFailed');
        } 
    });

    socket.on('addNote',(roomCode,noteToAdd)=>{
        const roomToEnter = currentRooms.filter(roomObject =>{
            return roomObject.roomCode === roomCode
         })[0];
         var existingNote = roomToEnter.notes.filter(note =>{
            return note.noteId === noteToAdd.noteId;
         })[0];
         // If it is an existing note just update the location
         if(existingNote){
            existingNote.positionX = noteToAdd.positionX;
            existingNote.positionY = noteToAdd.positionY;
         } else{
            roomToEnter.notes.push(noteToAdd);
         }
        
        socket.emit('noteUpdated',roomToEnter.notes);
    })
  });


const port = process.env.PORT || 5000;
http.listen(port);

console.log('App is listening on port ' + port);