const { ROTATION_STATES, MOVEMENT_TYPES } = require("../constants.js")
const { MovementWrapper } = require("../Movement/movementWrapper.js")

class RotationStateWrapper {
    constructor(rotationState) {
        if (ROTATION_STATES[rotationState] == undefined) {
            throw new Error(`Invalid construction of RotationStateWrapper using rotationState = ${rotationState}. rotation state must be either DEFAULT, CCW_1, CCW_2, CCW_3, CW_1, CW_2, or CW_3.`)
        }
        this.rotationState = ROTATION_STATES[rotationState]
    }

    getRotationState() {
        return this.rotationState 
    }

    getRotationString() {
        for (let key of Object.keys(ROTATION_STATES)) {
            if (ROTATION_STATES[key] == this.rotationState) {
                return key 
            }
        }
    }
    
    /**
     * 
     * @param {MovementWrapper} rotation 
     */
    rotateState(rotation) {
        if (rotation.getMove() == MOVEMENT_TYPES.CCW) {
            switch (this.rotationState) {
                case ROTATION_STATES.DEFAULT:
                    this.rotationState = ROTATION_STATES.CCW_1
                    break

                case ROTATION_STATES.CCW_1:
                    this.rotationState = ROTATION_STATES.CCW_2
                    break

                case ROTATION_STATES.CCW_2:
                    this.rotationState = ROTATION_STATES.CCW_3
                    break
                
                case ROTATION_STATES.CCW_3:
                    this.rotationState = ROTATION_STATES.DEFAULT
                    break
                
                case ROTATION_STATES.CW_1:
                    this.rotationState = ROTATION_STATES.DEFAULT
                    break
                
                case ROTATION_STATES.CW_2:
                    this.rotationState = ROTATION_STATES.CW_1
                    break
                
                case ROTATION_STATES.CW_3:
                    this.rotationState = ROTATION_STATES.CW_2
                    break
            }
            
        }   
        else if (rotation.getMove() == MOVEMENT_TYPES.CW) {
            switch (this.rotationState) {
                case ROTATION_STATES.DEFAULT:
                    this.rotationState = ROTATION_STATES.CW_1
                    break

                case ROTATION_STATES.CCW_1:
                    this.rotationState = ROTATION_STATES.DEFAULT
                    break

                case ROTATION_STATES.CCW_2:
                    this.rotationState = ROTATION_STATES.CCW_1
                    break

                case ROTATION_STATES.CCW_3:
                    this.rotationState = ROTATION_STATES.CCW_2
                    break

                case ROTATION_STATES.CW_1:
                    this.rotationState = ROTATION_STATES.CW_2
                    break

                case ROTATION_STATES.CW_2:
                    this.rotationState = ROTATION_STATES.CW_3
                    break

                case ROTATION_STATES.CW_3:
                    this.rotationState = ROTATION_STATES.DEFAULT
                    break
            }
        }
    }
    
}

module.exports = {
    RotationStateWrapper
}