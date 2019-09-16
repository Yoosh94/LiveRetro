import { Room, Participant, Note } from "room";
import { Request, Response } from "express";
import { Socket } from "socket.io";

let express = require('express');
let path = require('path');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let RoomGenerator = require('./RoomGenerator')
let currentRooms : Room[] = [];
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// // An api endpoint that returns a short list of items
// app.get('/api/getList', (req,res) => {
//     let list = ["item1", "item2", "item3"];
//     res.json(list);
//     console.log('Sent list of items');
// });

// Handles any requests that don't match the ones above
app.get('*', (req:Request,res:Response) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

io.on('connection', function(socket:Socket){
    console.log('a user connected');

    socket.on('createRoom',(name:string) => {
        console.log("Creating a room")
        let roomCode:string = RoomGenerator.Generate();
        let room :Room = RoomGenerator.Room();
        room.code = roomCode;
        const participant:Participant = {
            name: name
        };
        room.participants.push(participant);
        console.log(roomCode);
        currentRooms.push(room);
        console.log(currentRooms);
        socket.emit('roomCreated',roomCode);
    });

    socket.on('joinRoom',(roomCode:string,participantName:string)=>{

        const roomToEnter = currentRooms.filter(roomObject =>{
           return roomObject.code === roomCode
        });
        
        const participantToAdd : Participant = {
            name:participantName
        };

        if(roomToEnter.length === 1){
            roomToEnter[0].participants.push(participantToAdd);
            socket.emit('joinRoomSuccess',roomCode)
        }else{
            socket.emit('joinRoomFailed');
        } 
    });

    socket.on('addNote',(roomCode:string,noteToAdd:Note)=>{
        let roomToEnter = currentRooms.filter(roomObject =>{
            return roomObject.code === roomCode
         })[0];

         let existingNote = roomToEnter.notes.filter(note =>{
            return note.id === noteToAdd.id;
         })[0];

         // If it is an existing note just update the location
         if(existingNote){
            existingNote.positionX = noteToAdd.positionX;
            existingNote.positionY = noteToAdd.positionY;
         } else{
            roomToEnter.notes.push(noteToAdd);
         }
        console.log(roomToEnter.notes);
        socket.emit('noteUpdated',roomToEnter.notes);
    })
  });


const port = process.env.PORT || 5000;
http.listen(port);

console.log('App is listening on port ' + port);