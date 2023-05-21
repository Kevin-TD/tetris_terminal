const { GridHandler } = require("../Grid/gridHandler")
const { J_PIECE_REPRESENTATION, GRID_ROWS, GRID_COLS } = require("../constants.js")

class JPiece  {
    constructor() {
        this.Blocks = new GridHandler(GRID_ROWS, GRID_COLS)
        this.TextRepresentation = J_PIECE_REPRESENTATION

        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(1, 1, this.TextRepresentation)
        this.Blocks.enableEntry(2, 1, this.TextRepresentation)
        this.Blocks.enableEntry(2, 0, this.TextRepresentation)
    }
}

module.exports = {
    JPiece
}