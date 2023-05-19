const DISABLED_ENTRY_REPRESENTATION = "⬛"
const T_PIECE_REPRESENTATION = "🟪" 
const O_PIECE_REPRESENTATION = "🟨"
const I_PIECE_REPRESENTATION = "🟦"
const J_PIECE_REPRESENTATION = "⬜"
const L_PIECE_REPRESENTATION = "🟧"
const Z_PIECE_REPRESENTATION = "🟥"
const S_PIECE_REPRESENTATION = "🟩"

const GRID_ROWS = 4
const GRID_COLS = 4 

const DEBUG = true 
const FULL_DEPTH = true 

const MOVEMENT_TYPES = {
    LEFT: 1,
    RIGHT: 2,
    DOWN: 3, 
    CCW: 4,
    CW: 5,
}

const ROTATION_STATES = {
    DEFAULT: 0, 
    CCW_1: 1, 
    CCW_2: 2, 
    CCW_3: 3, 
    CW_1: -1, 
    CW_2: -2, 
    CW_3: -3, 
}

const DEBUG_LOG = (x) => {
    if (FULL_DEPTH) console.dir(x, {depth: null})
    else if (DEBUG) console.log(x)
}

module.exports = {
    DISABLED_ENTRY_REPRESENTATION,
    T_PIECE_REPRESENTATION,
    O_PIECE_REPRESENTATION,
    I_PIECE_REPRESENTATION,
    J_PIECE_REPRESENTATION,
    L_PIECE_REPRESENTATION,
    Z_PIECE_REPRESENTATION,
    S_PIECE_REPRESENTATION,
    GRID_ROWS,
    GRID_COLS,
    MOVEMENT_TYPES, 
    ROTATION_STATES, 
    DEBUG_LOG,
}