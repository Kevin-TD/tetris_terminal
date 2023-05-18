const { Board } = require("./Board/board.js")
const { TPiece } = require("./Pieces/t_piece.js")
const { OPiece } = require("./Pieces/o_piece.js")
const prompt = require("prompt-sync")({ sigint: true })

// TODO: 
/*
    impl rotation for all pieces 
    impl bag generation 
    impl line clearing
    impl score 
    convert to discordjs 
*/


// rows 16 to 24  
// cols typically 10 

// T, O, I, J, L, Z, S

let Game = new Board(16, 10) 
Game.insertPiece(new OPiece())

Game.printBoard()
let input = prompt("Insert input (l - left, r - right, s - ccw rot, f - cw rot d - down, h - hard drop, q - quit): ")
while (input != "q") {
    console.log(input)

    Game.input(input)

    Game.printBoard()

    input = prompt("Insert input (l - left, r - right, s - ccw rot, f - cw rot d - down, h - hard drop, q - quit): ")
}


