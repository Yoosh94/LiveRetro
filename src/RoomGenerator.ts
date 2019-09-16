import { Room } from "room";

module.exports = {
    Generate: function () {
        var text = "";  
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";      
        for(var i = 0; i < 10; i++) {     
            text += possible.charAt(Math.floor(Math.random() * possible.length));    
        }
        return text;
    },

    Room : ():Room => {
        let room : Room = {
            code:'',
            notes:[],
            participants:[]
        };
        return room;
    }
};