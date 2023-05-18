const { GridHolder } = require("../GridHolder/gridHolder")
const { L_PIECE_REPRESENTATION, GRID_ROWS, GRID_COLS } = require("../constants.js")

class LPiece  {
    constructor() {
        this.Blocks = new GridHolder(GRID_ROWS, GRID_COLS)
        this.TextRepresentation = L_PIECE_REPRESENTATION

        this.Blocks.enableEntry(0, 0, this.TextRepresentation)
        this.Blocks.enableEntry(1, 0, this.TextRepresentation)
        this.Blocks.enableEntry(2, 0, this.TextRepresentation)
        this.Blocks.enableEntry(2, 1, this.TextRepresentation)
    }
}

module.exports = {
    LPiece
}