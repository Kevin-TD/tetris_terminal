const { Board } = require("./Board/board.js")
const { InputWrapper } = require("./Input/inputWrapper.js")

// TODO: 
/*
    impl rotation for all pieces [DONE]
    impl bag generation [DONE]
    impl seeing bag []
    impl hold
    impl line clearing
    impl score 
    remove all useless imports 
    make ghost piece [DONE]
    handle game ending
    convert to discordjs 
    make debuglog a util function
*/

class Tetris {
    constructor() {
        this.Game = new Board(16, 10)
    }
    getBoardString() {
        return this.Game.getBoardString()
    }
    sendInput(input) {
        this.Game.input(new InputWrapper(input))
    }
    gameIsOver() {
        return this.Game.gameHasEnded()
    }
    getScore() {
        return this.Game.Score.getScore()
    }
    getBagStringArray() {
        return this.Game.Bag.getBagString()
    }
    getHoldPieceString() {
        return this.Game.Bag.getHoldPieceString()
    }
    getFormattedBoardString() {
        
        let holdPiece = this.getHoldPieceString().split("\n")

        let board = this.getBoardString().split("\n")

        let addedBoard = this.getBagStringArray().slice(0, 2).map(x => x.split("\n"))
        for (let line of addedBoard) {
            if (line != addedBoard[addedBoard.length - 1])
                line.push("\n")
        }
        addedBoard = addedBoard.join("").replaceAll(",", "\n").split("\n")

        addedBoard.unshift("Bag:")
        addedBoard.push("")
        addedBoard.push("Hold:")
        addedBoard.push(...holdPiece)
        addedBoard.push("")
        addedBoard.push(`Score: ${this.getScore()}`)

        for (let i = 0; i < board.length; i++) {
            board[i] += "    " + (addedBoard[i] || "") + "    "
        }

        return board.join("\n")
    }
}

const PIECE_REPRESENTATIONS = {
    DISABLED_ENTRY_REPRESENTATION: "⬛",
    T_PIECE_REPRESENTATION: "🟪" ,
    O_PIECE_REPRESENTATION: "🟨",
    I_PIECE_REPRESENTATION: "🟦",
    J_PIECE_REPRESENTATION: "⬜",
    L_PIECE_REPRESENTATION: "🟧",
    Z_PIECE_REPRESENTATION: "🟥",
    S_PIECE_REPRESENTATION: "🟩",
    GHOST_PIECE_REPRESENTATION: "🔳",
}

const INPUTS = {
    MOVE_LEFT: "MOVE_LEFT",
    MOVE_RIGHT: "MOVE_RIGHT",
    ROTATE_CCW: "ROTATE_CCW",
    ROTATE_CW: "ROTATE_CW",
    MOVE_DOWN_1: "MOVE_DOWN_1",
    HARD_DROP_AND_FINALIZE: "HARD_DROP_AND_FINALIZE",
    QUIT: "QUIT",
    HOLD_PIECE: "HOLD_PIECE",
    HARD_DROP_DO_NOT_FINALIZE: "HARD_DROP_DO_NOT_FINALIZE"
}




module.exports = {
    Tetris,
    PIECE_REPRESENTATIONS,
    INPUTS,
}
