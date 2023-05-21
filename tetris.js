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
}




module.exports = {
    Tetris,
}
