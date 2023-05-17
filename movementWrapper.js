const { MOVEMENT_TYPES } = require("./constants.js")

class MovementWrapper {
    constructor(move) {
        if (MOVEMENT_TYPES[move] == undefined) {
            throw new Error(`Invalid construction of Movement using move = ${move}. move must be either LEFT, RIGHT, CCW, or CW`)
        }
        this.move = MOVEMENT_TYPES[move]
    }

    getMove() {
        return this.move 
    }
    
}

module.exports = {
    MovementWrapper
}