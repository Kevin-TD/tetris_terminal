const { MOVEMENT_TYPES } = require("../constants.js")

class MovementWrapper {
    constructor(move) {
        if (MOVEMENT_TYPES[move] == undefined) {
            throw new Error(`Invalid construction of Movement using move = ${move}. move must be either LEFT, RIGHT, CCW, or CW`)
        }
        this.move = MOVEMENT_TYPES[move]
    }

    getMovementString() {
        for (let key of Object.keys(MOVEMENT_TYPES)) {
            if (MOVEMENT_TYPES[key] == this.move) {
                return key 
            }
        }
    }

    getMove() {
        return this.move 
    }
    
}

module.exports = {
    MovementWrapper
}