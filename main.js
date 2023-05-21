const { Tetris } = require("./tetris")
const prompt = require("prompt-sync")({ sigint: true })

let text = "Insert input (l - left, r - right, s - ccw rot, f - cw rot d - down, h - hard drop, q - quit, u - hold, b - dropf): "
let tetris = new Tetris()
console.log(tetris.getBoardString())

let input = prompt(text)
while (input != "q") {

    switch (input) {
        case "l":
            tetris.sendInput("MOVE_LEFT")
            break 
        case "r":
            tetris.sendInput("MOVE_RIGHT")
            break
        case "s":
            tetris.sendInput("ROTATE_CCW")
            break
        case "f":
            tetris.sendInput("ROTATE_CW")
            break
        case "d":
            tetris.sendInput("MOVE_DOWN_1")
            break
        case "h":
            tetris.sendInput("HARD_DROP_AND_FINALIZE")
            break
        case "q":
            tetris.sendInput("QUIT")
            break
        case "u":
            tetris.sendInput("HOLD_PIECE")
            break
        case "b":
            tetris.sendInput("HARD_DROP_DO_NOT_FINALIZE")
            break
    }

    console.log("bag string array = ")
    for (let str of tetris.getBagStringArray()) {
        console.log(str + "\n")
    }

    console.log("hold piece = ")
    console.log(tetris.getHoldPieceString())

    console.log("board =")
    console.log(tetris.getBoardString())

    console.log(`score = ${tetris.getScore()}`)


    if (tetris.gameIsOver()) {
        console.log("no more games for you")
        break
    }

    input = prompt(text)
}