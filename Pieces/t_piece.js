const { GridHolder } = require("../GridHolder/gridHolder")
const { T_PIECE_REPRESENTATION, GRID_ROWS, GRID_COLS, MOVEMENT_TYPES, ROTATION_STATES } = require("../constants.js")
const { MovementWrapper } = require("../Movement/movementWrapper")
const { RotationStateWrapper } = require("../RotationStates/rotationStateWrapper")
const { DEBUG_LOG } = require("../constants")
const { sortDoubleArray } = require("../utils")
const fs = require("fs")



let data = fs.readFileSync("./Pieces/PieceRotData/t_piece_rot_data.txt", "utf8").split("\n")
        
let gmap = {}
gmap["CCW"] = {}
gmap["CW"] = {}

for (let line of data) {
    let parts = line.split(" ")
    let rotationType = parts[0].trim()
    let rotationState = parts[1].trim()
    let piece_0 = parts[2].split(",").map(x => parseInt(x))
    let piece_1 = parts[3].split(",").map(x => parseInt(x))
    let piece_2 = parts[4].split(",").map(x => parseInt(x))
    let piece_3 = parts[5].split(",").map(x => parseInt(x))
    

    gmap[rotationType][rotationState] =  [piece_0, piece_1, piece_2, piece_3]
}

class TPiece  {
    constructor() {
        this.Blocks = new GridHolder(GRID_ROWS, GRID_COLS)
        this.TextRepresentation = T_PIECE_REPRESENTATION
        this.map = {} // TODO: give better name...more wrappers!?

        this.Blocks.enableEntry(1, 0, this.TextRepresentation)
        this.Blocks.enableEntry(1, 1, this.TextRepresentation)
        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(1, 2, this.TextRepresentation)
    }   


    /**
     * 
     * @param {String} fileName 
     */
    loadRotationData(fileName) {
        
        // DEBUG_LOG(this.map)

    }
    
    
    /**
     * 
     * @param {MovementWrapper} rotationType 
     * @param {RotationStateWrapper} rotationState 
     * @param {number[[]]} activePieceEntries 
     * @returns {number[[]]}
     */
    static rotate(rotationType, rotationState, activePieceEntries) {
        // assume the order of the pieces (from first to last) goes from top to bottom, left to right 
        
        let newEntries = []
        let sortedEntries = sortDoubleArray(activePieceEntries)
        let selection = gmap[rotationType.getMovementString()][rotationState.getRotationString()]

        DEBUG_LOG(rotationType.getMovementString())
        DEBUG_LOG(rotationState.getRotationString())


        for (let i = 0; i < activePieceEntries.length; i++) {
            let row = sortedEntries[i][0]
            let col = sortedEntries[i][1]

            newEntries.push([
                row + selection[i][0], col + selection[i][1]
            ])
        }

    
        return newEntries
    }
}

module.exports = {
    TPiece
}