/**
 * Piece representations are strings used in the game's grid string 
 */
const DISABLED_ENTRY_REPRESENTATION = "⬛"
const T_PIECE_REPRESENTATION = "🟪" 
const O_PIECE_REPRESENTATION = "🟨"
const I_PIECE_REPRESENTATION = "🟦"
const J_PIECE_REPRESENTATION = "⬜"
const L_PIECE_REPRESENTATION = "🟧"
const Z_PIECE_REPRESENTATION = "🟥"
const S_PIECE_REPRESENTATION = "🟩"
const GHOST_PIECE_REPRESENTATION = "🔳"

/**
 * GRID_ROWS and GRID_COLS describe the rows and cols of the grids used in constructing the pieces. 4x4 used to cover all pieces
 */
const GRID_ROWS = 4
const GRID_COLS = 4 

/**
 * Constant is used to shift pieces rightward when entering 
 */
const LEFT_PADDING = 3

/**
 * Constant below represents how many moves can be made after block touches ground. Sliding across the ground increment move mount 
 */
const GROUND_MOVES_LIMIT = 4 

const DEBUG = false 
const FULL_DEPTH = true 

const MOVEMENT_TYPES = {
    LEFT: 0,
    RIGHT: 1,
    DOWN: 2, 
    CCW: 3,
    CW: 4,
}

const INPUT_TYPES = {
    MOVE_LEFT: 0, 
    MOVE_RIGHT: 1, 
    ROTATE_CCW: 2, 
    ROTATE_CW: 3, 
    MOVE_DOWN_1: 4, 
    HARD_DROP_AND_FINALIZE: 5, 
    HARD_DROP_DO_NOT_FINALIZE: 6, 
    HOLD_PIECE: 7,
    QUIT: 8,
}

const ROTATION_STATES = {
    DEFAULT: 0, 
    CCW_1: 1, 
    CCW_2: 2, 
    CCW_3: 3, 
    CW_1: 4, 
    CW_2: 5, 
    CW_3: 6, 
}

const DEBUG_LOG = (x) => {
    if (DEBUG && FULL_DEPTH) console.dir(x, {depth: null})
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
    GHOST_PIECE_REPRESENTATION,
    GRID_ROWS,
    GRID_COLS,
    LEFT_PADDING, 
    GROUND_MOVES_LIMIT,
    MOVEMENT_TYPES, 
    INPUT_TYPES,
    ROTATION_STATES, 
    DEBUG_LOG,
}