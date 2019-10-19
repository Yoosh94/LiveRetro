import { Request, Response } from "express";
import express from "express";
import httpModule from "http";
import path from "path";
import { Note, Participant, Room } from "room";
import socketModule, { Socket } from "socket.io";
const app = express();
const http = httpModule.createServer(app);
const io = socketModule(http);
import { EmptyRoom, Generate } from "./RoomGenerator";
const currentRooms: Room[] = [];
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Handles any requests that don't match the ones above
app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

io.on("connection", (socket: Socket) => {
    console.log("a user connected");

    socket.on("createRoom", (name: string) => {
        console.log("Creating a room");
        const roomCode: string = Generate();
        const room: Room = EmptyRoom();
        room.code = roomCode;
        const participant: Participant = {
            name,
        };
        room.participants.push(participant);
        console.log(roomCode);
        currentRooms.push(room);
        console.log(currentRooms);
        socket.join(roomCode);
        socket.emit("roomCreated", roomCode);
    });

    socket.on("joinRoom", (roomCode: string, participantName: string) => {

        const roomToEnter = currentRooms.filter((roomObject) => {
           return roomObject.code === roomCode;
        });

        const participantToAdd: Participant = {
            name: participantName,
        };

        if (roomToEnter.length === 1) {
            roomToEnter[0].participants.push(participantToAdd);
            socket.join(roomCode);
            socket.emit("joinRoomSuccess", roomCode);
        } else {
            socket.emit("joinRoomFailed");
        }
    });

    socket.on("addNote", (roomCode: string, noteToAdd: Note) => {
        const roomToEnter = currentRooms.filter((roomObject) => {
            return roomObject.code === roomCode;
         })[0];

        const existingNote = roomToEnter.notes.filter((note) => {
            return note.id === noteToAdd.id && note.author === noteToAdd.author;
         })[0];

         // If it is an existing note just update the location
        if (existingNote) {
            existingNote.positionX = noteToAdd.positionX;
            existingNote.positionY = noteToAdd.positionY;
         } else {
            roomToEnter.notes.push(noteToAdd);
         }
        console.log(roomToEnter.notes);
        socket.to(roomCode).emit("noteUpdated", roomToEnter.notes);
    });
  });
const port = process.env.PORT || 5000;
http.listen(port);

console.log("App is listening on port " + port);
