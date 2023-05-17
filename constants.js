const DISABLED_ENTRY_REPRESENTATION = "⬛"
const DEBUG = true 

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
    if (DEBUG) console.log(x)
}

module.exports = {
    DISABLED_ENTRY_REPRESENTATION,
    DEBUG, 
    MOVEMENT_TYPES, 
    ROTATION_STATES, 
    DEBUG_LOG,

}