const { RotationStateWrapper } = require("../RotationStates/rotationStateWrapper")

class MovingPiece {
    constructor() {
        this.activePiece = []
        this.pieceRepresentation = ""
        this.rotationState =  new RotationStateWrapper("DEFAULT")
        this.groundHasBeenTouched = false
        this.groundMovesMade = 0 
    }
}

module.exports = {
    MovingPiece
}