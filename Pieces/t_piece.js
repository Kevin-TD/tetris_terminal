const { GridHolder } = require("../GridHolder/gridHolder")
const { T_PIECE_REPRESENTATION, GRID_ROWS, GRID_COLS } = require("../constants.js")


class TPiece  {
    // TODO: make text reps global constants instead of statics
    constructor() {
        this.Blocks = new GridHolder(GRID_ROWS, GRID_COLS)
        this.TextRepresentation = T_PIECE_REPRESENTATION

        this.Blocks.enableEntry(1, 0, this.TextRepresentation)
        this.Blocks.enableEntry(1, 1, this.TextRepresentation)
        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(1, 2, this.TextRepresentation)
    }

    /**
     * 
     * @param {-1 | 1} rotationType -1 = cw, 1 = ccw
     * @param {-3 | -2 | -1 | 0 | 1 | 2 | 3} rotationState 
     * @param {number[[]]} activePieceEntires 
     * @returns {number[[]]}
     */
    static rotate(rotationType, rotationState, activePieceEntries) {
        // assume the order of the pieces (from first to last) goes from top to bottom, left to right 

        let newEntries = []

        if (rotationType == 1) { // ccw 
            if (rotationState == 0) {
                
                for (let i = 0; i < activePieceEntries.length; i++) {
                    let row = activePieceEntries[i][0]
                    let col = activePieceEntries[i][1]

                    if (i == 0 || i == 1 || i == 2) {
                        newEntries.push([row, col])
                    }
                    else if (i == 3) {
                        newEntries.push([row + 1, col - 1])
                    }
                }

            }

        }
        else if (rotationType == -  1) { // cw
            
        }

        return newEntries
    }
}

module.exports = {
    TPiece
}