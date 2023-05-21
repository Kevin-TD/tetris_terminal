const { GridHandler } = require("../Grid/gridHandler")
const { I_PIECE_REPRESENTATION, GRID_ROWS, GRID_COLS } = require("../constants.js")

class IPiece  {
    constructor() {
        this.Blocks = new GridHandler(GRID_ROWS, GRID_COLS)
        this.TextRepresentation = I_PIECE_REPRESENTATION

        this.Blocks.enableEntry(0, 0, this.TextRepresentation)
        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(0, 2, this.TextRepresentation)
        this.Blocks.enableEntry(0, 3, this.TextRepresentation)
    }
}

module.exports = {
    IPiece
}