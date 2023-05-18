const { GridHolder } = require("../GridHolder/gridHolder")
const { O_PIECE_REPRESENTATION, GRID_ROWS, GRID_COLS } = require("../constants.js")


class OPiece  {
    constructor() {
        this.Blocks = new GridHolder(GRID_ROWS, GRID_COLS)
        this.TextRepresentation = O_PIECE_REPRESENTATION

        this.Blocks.enableEntry(0, 0, this.TextRepresentation)
        this.Blocks.enableEntry(1, 0, this.TextRepresentation)
        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(1, 1, this.TextRepresentation)
    }

    /**
     * 
     * @param {-1 | 1} rotationType -1 = cw, 1 = ccw
     * @param {-3 | -2 | -1 | 0 | 1 | 2 | 3} rotationState 
     * @param {number[[]]} activePieceEntires 
     * @returns {number[[]]}
     */
    static rotate(rotationType, rotationState, activePieceEntries) {

    }
}

module.exports = {
    OPiece
}