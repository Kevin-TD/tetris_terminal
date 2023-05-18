const { GridHolder } = require("../GridHolder/gridHolder")
const { S_PIECE_REPRESENTATION, GRID_ROWS, GRID_COLS } = require("../constants.js")

class SPiece  {
    constructor() {
        this.Blocks = new GridHolder(GRID_ROWS, GRID_COLS)
        this.TextRepresentation = S_PIECE_REPRESENTATION

        this.Blocks.enableEntry(1, 0, this.TextRepresentation)
        this.Blocks.enableEntry(1, 1, this.TextRepresentation)
        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(0, 2, this.TextRepresentation)
    }
}

module.exports = {
    SPiece
}