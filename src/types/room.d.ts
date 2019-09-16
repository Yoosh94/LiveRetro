export type Room = {
    code:string,
    participants: Participant[],
    notes : Note[]
}

interface Participant {
    name:string
}

interface Note {
    id : number,
    positionX:number,
    positionY:number,
}