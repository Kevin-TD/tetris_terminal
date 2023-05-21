const fs = require("fs")
const CONSTANTS = require("../constants")
const { sortDoubleArray } = require("../utils")

function loadData(fileName) {
    let map = {}
    map.CCW = {}
    map.CW = {} 

    let data = fs.readFileSync(fileName, "utf8").split("\n")

    for (let line of data) {

        let parts = line.split(" ")
        let rotationType = parts[0].trim()
        let rotationState = parts[1].trim()
        let piece_0 = parts[2].split(",").map(x => parseInt(x))
        let piece_1 = parts[3].split(",").map(x => parseInt(x))
        let piece_2 = parts[4].split(",").map(x => parseInt(x))
        let piece_3 = parts[5].split(",").map(x => parseInt(x))
        
        map[rotationType][rotationState] =  [piece_0, piece_1, piece_2, piece_3]
    }

    return map 
}

const TPieceRotationMap = loadData("./Pieces/PieceRotData/t_piece.txt")
const OPieceRotationMap = loadData("./Pieces/PieceRotData/o_piece.txt")
const IPieceRotationMap = loadData("./Pieces/PieceRotData/i_piece.txt")
const JPieceRotationMap = loadData("./Pieces/PieceRotData/j_piece.txt")
const LPieceRotationMap = loadData("./Pieces/PieceRotData/l_piece.txt")
const ZPieceRotationMap = loadData("./Pieces/PieceRotData/z_piece.txt")
const SPieceRotationMap = loadData("./Pieces/PieceRotData/s_piece.txt")


/**
 * 
 * @param {MovementWrapper} rotationType 
 * @param {RotationStateWrapper} rotationState 
 * @param {number[[]]} activePieceEntries 
 * @param {String} pieceRepresentation
 * @returns {number[[]]}
*/
function getRotatedEntries(rotationType, rotationState, activePieceEntries, pieceRepresentation) {
    // the order of the pieces (from first to last) goes from top to bottom, left to right 
    
    let newEntries = []
    let sortedEntries = sortDoubleArray(activePieceEntries)
    let map

    switch (pieceRepresentation) {
        case CONSTANTS.T_PIECE_REPRESENTATION:
            map = TPieceRotationMap
            break

        case CONSTANTS.O_PIECE_REPRESENTATION:
            map = OPieceRotationMap
            break
            
        case CONSTANTS.I_PIECE_REPRESENTATION:
            map = IPieceRotationMap
            break
            
        case CONSTANTS.J_PIECE_REPRESENTATION:
            map = JPieceRotationMap
            break

        case CONSTANTS.L_PIECE_REPRESENTATION:
            map = LPieceRotationMap
            break

        case CONSTANTS.Z_PIECE_REPRESENTATION:
            map = ZPieceRotationMap
            break

        case CONSTANTS.S_PIECE_REPRESENTATION:
            map = SPieceRotationMap
            break
    }
   

    let selection = map[rotationType.getMovementString()][rotationState.getRotationString()]

    for (let i = 0; i < activePieceEntries.length; i++) {
        let row = sortedEntries[i][0]
        let col = sortedEntries[i][1]

        newEntries.push([row + selection[i][0], col + selection[i][1]])
    }

    return newEntries
}

module.exports = {
    getRotatedEntries
}