const { TPiece } = require("../Pieces/t_piece.js")
const { OPiece } = require("../Pieces/o_piece.js")
const { IPiece } = require("../Pieces/i_piece.js")
const { JPiece } = require("../Pieces/j_piece.js")
const { LPiece } = require("../Pieces/l_piece.js")
const { ZPiece } = require("../Pieces/z_piece.js")
const { SPiece } = require("../Pieces/s_piece.js")

const CONSTANTS = require("../constants")

function getPieceFromPieceRep(pieceRep) {
    if (pieceRep == CONSTANTS.T_PIECE_REPRESENTATION) {
        return new TPiece()
    }
    else if (pieceRep == CONSTANTS.O_PIECE_REPRESENTATION) {
        return new OPiece()
    }
    else if (pieceRep == CONSTANTS.I_PIECE_REPRESENTATION) {
        return new IPiece()
    }
    else if (pieceRep == CONSTANTS.J_PIECE_REPRESENTATION) {
        return new JPiece()
    }
    else if (pieceRep == CONSTANTS.L_PIECE_REPRESENTATION) {
        return new LPiece()
    }
    else if (pieceRep == CONSTANTS.Z_PIECE_REPRESENTATION) {
        return new ZPiece()
    }
    else if (pieceRep == CONSTANTS.S_PIECE_REPRESENTATION) {
        return new SPiece()
    }
}

function getStringPieceFromPieceRep(pieceRep) {
    if (pieceRep == CONSTANTS.T_PIECE_REPRESENTATION) {
        return CONSTANTS.DISABLED_ENTRY_REPRESENTATION + CONSTANTS.T_PIECE_REPRESENTATION + "  \n" +  CONSTANTS.T_PIECE_REPRESENTATION.repeat(3)
    }
    else if (pieceRep == CONSTANTS.O_PIECE_REPRESENTATION) {
        return CONSTANTS.O_PIECE_REPRESENTATION.repeat(2) + "\n" + CONSTANTS.O_PIECE_REPRESENTATION.repeat(2)
    }
    else if (pieceRep == CONSTANTS.I_PIECE_REPRESENTATION) {
        return CONSTANTS.I_PIECE_REPRESENTATION.repeat(4)
    }
    else if (pieceRep == CONSTANTS.J_PIECE_REPRESENTATION) {
        return (CONSTANTS.DISABLED_ENTRY_REPRESENTATION+  CONSTANTS.J_PIECE_REPRESENTATION + "\n").repeat(2) + CONSTANTS.J_PIECE_REPRESENTATION.repeat(2)
    }
    else if (pieceRep == CONSTANTS.L_PIECE_REPRESENTATION) {
        return (CONSTANTS.L_PIECE_REPRESENTATION + CONSTANTS.DISABLED_ENTRY_REPRESENTATION + "\n").repeat(2) + CONSTANTS.L_PIECE_REPRESENTATION.repeat(2)
    }
    else if (pieceRep == CONSTANTS.Z_PIECE_REPRESENTATION) {
        return  CONSTANTS.Z_PIECE_REPRESENTATION.repeat(2) + CONSTANTS.DISABLED_ENTRY_REPRESENTATION + "\n" +  CONSTANTS.DISABLED_ENTRY_REPRESENTATION + CONSTANTS.Z_PIECE_REPRESENTATION.repeat(2)
    }
    else if (pieceRep == CONSTANTS.S_PIECE_REPRESENTATION) {
        return CONSTANTS.DISABLED_ENTRY_REPRESENTATION + CONSTANTS.S_PIECE_REPRESENTATION.repeat(2) + "\n" +  CONSTANTS.S_PIECE_REPRESENTATION.repeat(2) + CONSTANTS.DISABLED_ENTRY_REPRESENTATION
    }
}

module.exports = {
    getPieceFromPieceRep,
    getStringPieceFromPieceRep
}