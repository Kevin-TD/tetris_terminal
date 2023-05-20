const { TPiece } = require("../Pieces/t_piece.js")
const { OPiece } = require("../Pieces/o_piece.js")
const { IPiece } = require("../Pieces/i_piece.js")
const { JPiece } = require("../Pieces/j_piece.js")
const { LPiece } = require("../Pieces/l_piece.js")
const { ZPiece } = require("../Pieces/z_piece.js")
const { SPiece } = require("../Pieces/s_piece.js")

const { GHOST_PIECE_REPRESENTATION } = require("../constants.js")

const { shuffleArray } = require("../utils.js")

const { MovingPiece } = require("./movingPiece.js")


class BagHandler {
    constructor() {
        this.Bag = shuffleArray([
            new TPiece(), new OPiece(), new IPiece(), new JPiece(), new LPiece(), new ZPiece(), new SPiece(),
            new TPiece(), new OPiece(), new IPiece(), new JPiece(), new LPiece(), new ZPiece(), new SPiece()
        ])
        this.holdPiece = []
        this.movingPiece = new MovingPiece() 
        this.ghostPiece = new MovingPiece()
        this.ghostPiece.pieceRepresentation = GHOST_PIECE_REPRESENTATION
    }
    getNextPiece() {
        let piece = this.Bag.shift() 

        if (this.Bag.length == 5) {
            this.Bag.push(...shuffleArray([new TPiece(), new OPiece(), new IPiece(), new JPiece(), new LPiece(), new ZPiece(), new SPiece()]))
        }

        return piece 
    }
    holdPiece() {
        
    }
    
}

module.exports = {
    BagHandler
}