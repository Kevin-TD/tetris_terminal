const { TPiece } = require("../Pieces/t_piece.js")
const { OPiece } = require("../Pieces/o_piece.js")
const { IPiece } = require("../Pieces/i_piece.js")
const { JPiece } = require("../Pieces/j_piece.js")
const { LPiece } = require("../Pieces/l_piece.js")
const { ZPiece } = require("../Pieces/z_piece.js")
const { SPiece } = require("../Pieces/s_piece.js")

const { shuffleArray } = require("../utils.js")
const { getPieceFromPieceRep, getStringPieceFromPieceRep } = require("../Pieces/piece.js")

const { MovingPiece } = require("./movingPiece.js")


class BagHandler {
    constructor() {
        this.Bag = this.generatePieces()
        this.Bag.push(...this.generatePieces())
        this.pieceInHold = undefined
        this.canUseHold = true
        this.movingPiece = new MovingPiece() 
    }
    generatePieces() {
        return shuffleArray([new TPiece(), new OPiece(), new IPiece(), new JPiece(), new LPiece(), new ZPiece(), new SPiece()])
    }
    getNextPiece() {
        let piece = this.Bag.shift() 

        if (this.Bag.length == 5) {
            this.Bag.push(...this.generatePieces())
        }

        return piece 
    }
    getBagString() {
        let bag = []
        for (let i = 0; i < 5; i++) {
            bag.push(getStringPieceFromPieceRep(this.Bag[i].TextRepresentation))
        }
        return bag
    }
    getHoldPieceString() {
        if (this.pieceInHold == undefined) return ""
        return getStringPieceFromPieceRep(this.pieceInHold.TextRepresentation)
    }
    holdPiece(pieceRep) {
        this.pieceInHold = getPieceFromPieceRep(pieceRep)
    }
    getHoldPiece() {
        return this.pieceInHold
    }
    holdPieceExists() {
        return this.pieceInHold != undefined
    }
    
}

module.exports = {
    BagHandler
}