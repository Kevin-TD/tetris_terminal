const { RotationStateWrapper } = require("../RotationStates/rotationStateWrapper")

class MovingPiece {
    constructor() {
        this.entries = []
        this.pieceRepresentation = ""
        this.rotationState =  new RotationStateWrapper("DEFAULT")
        this.groundHasBeenTouched = false
        this.groundMovesMade = 0 
    }
    // TODO: rename to clear?
    reset() {
        this.entries = []
        this.pieceRepresentation = ""
        this.rotationState =  new RotationStateWrapper("DEFAULT")
        this.groundHasBeenTouched = false
        this.groundMovesMade = 0 
    }
}

module.exports = {
    MovingPiece
}