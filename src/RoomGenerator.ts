import { Room } from "room";

export function Generate(): string {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 10; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

export function EmptyRoom(): Room {
        const room: Room = {
            code: "",
            notes: [],
            participants: [],
        };
        return room;
    }

