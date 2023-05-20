const CONSTANTS = require("../constants")
const { GridHolder } = require("../GridHolder/gridHolder")
const { MovementWrapper } = require("../Movement/movementWrapper")
const { RotationStateWrapper }  = require("../RotationStates/rotationStateWrapper")
const { sortDoubleArray } = require("../utils")
const RotationHandler = require("../Pieces/rotation_maps")
const { BagHandler } = require("../Bag/bagHandler")

const { TPiece } = require("../Pieces/t_piece.js")
const { OPiece } = require("../Pieces/o_piece.js")
const { IPiece } = require("../Pieces/i_piece.js")
const { JPiece } = require("../Pieces/j_piece.js")
const { LPiece } = require("../Pieces/l_piece.js")
const { ZPiece } = require("../Pieces/z_piece.js")
const { SPiece } = require("../Pieces/s_piece.js")


// TODO: change dx dy to like change in row, change in col. i dont like the var swappin
// TODO: make left padding, ground moves limit into global constants 
// TODO: make better list comparison function. doing .toStrings is just cringe, it being less optimal aside 
// ! TODO: when finalizing because it hit the ground, make sure it gets DROPPED and not mid-rotation. perhaps you may want to not change it every time a rotation happens. just gotta make sure to not terminate if it's in the air. 
// TODO: it is not detecting properly if it hits the ground. like when it's right on top another piece, that should be the ground. 
// TODO: when the game ends make sure the last frame shows even if there is a seemingly malformed block 


class Board {
    constructor(rows, cols) {
        /** @protected {number[]} matrix holder */
        this.Grid = new GridHolder(rows, cols) // TODO: rename to "handler"?
        this.Bag = new BagHandler()

        this.insertPiece(this.Bag.getNextPiece())

    }

    /**
     * @returns {void} 
     */
    printBoard() {
        console.log("********")

        this.Bag.ghostPiece.entries = this.hardDropEntries(this.Bag.movingPiece.entries)
        if (
            !this.Bag.movingPiece.entries.some(x => this.Bag.ghostPiece.entries.some(y => x == y.toString()))
            // TODO: make less cringe ^^^^
        ) { 
            // check if they share no elements

            for (let i = 0; i < this.Bag.ghostPiece.entries.length; i++) {
                let row = this.Bag.ghostPiece.entries[i][0]
                let col = this.Bag.ghostPiece.entries[i][1]
                this.Grid.enableEntry(row, col, CONSTANTS.GHOST_PIECE_REPRESENTATION)
            }

            this.Grid.printGrid()

            for (let i = 0; i < this.Bag.ghostPiece.entries.length; i++) {
                let row = this.Bag.ghostPiece.entries[i][0]
                let col = this.Bag.ghostPiece.entries[i][1]
                this.Grid.disableEntry(row, col)
            }
        }
        else {
            this.Grid.printGrid()
        }

        // this.Grid.printGrid()
        console.log("********")
    }

    /**
     * 
     * @param {TPiece | OPiece | IPiece | JPiece | LPiece | ZPiece | SPiece} piece 
     */
    insertPiece(piece) {
        let m = piece.Blocks.Grid 


        let i = 0 
        while(m.length != 0) {
            CONSTANTS.DEBUG_LOG("hi")
            CONSTANTS.DEBUG_LOG(m)


            if (
                piece.Blocks.entryIsEnabled(0, 0) &&  // check to see if this piece could be added 
                this.Grid.entryIsEnabled(i, 0 + CONSTANTS.LEFT_PADDING) // is this piece interfering with an enabled slot?
            ) {
                console.log("game end?", i, CONSTANTS.LEFT_PADDING)
                return;
            }
            if (
                piece.Blocks.entryIsEnabled(0, 1) &&
                this.Grid.entryIsEnabled(i, 1 + CONSTANTS.LEFT_PADDING) 
            ) {
                console.log("game end?", i, CONSTANTS.LEFT_PADDING + 1)
                return;
            }

            if (
                piece.Blocks.entryIsEnabled(0, 2) &&
                this.Grid.entryIsEnabled(i, 2 + CONSTANTS.LEFT_PADDING) 
                
            ) {
                console.log("game end?", i, CONSTANTS.LEFT_PADDING +  2)
                return;
            }

            if (
                piece.Blocks.entryIsEnabled(0, 3) &&
                this.Grid.entryIsEnabled(i, 3 + CONSTANTS.LEFT_PADDING) 
            ) {
                console.log("game end?", i, CONSTANTS.LEFT_PADDING +  3)
                return;
            }
      

            if (m[0][0] != CONSTANTS.DISABLED_ENTRY_REPRESENTATION) this.Grid.enableEntry(i, 0 + CONSTANTS.LEFT_PADDING, m[0][0])
            if (m[0][1] != CONSTANTS.DISABLED_ENTRY_REPRESENTATION) this.Grid.enableEntry(i, 1 + CONSTANTS.LEFT_PADDING, m[0][1])
            if (m[0][2] != CONSTANTS.DISABLED_ENTRY_REPRESENTATION) this.Grid.enableEntry(i, 2 + CONSTANTS.LEFT_PADDING, m[0][2])
            if (m[0][3] != CONSTANTS.DISABLED_ENTRY_REPRESENTATION) this.Grid.enableEntry(i, 3 + CONSTANTS.LEFT_PADDING, m[0][3])
    
            
            if (piece.Blocks.entryIsEnabled(0, 0)) {
                this.Bag.movingPiece.entries.push([i, 0 + CONSTANTS.LEFT_PADDING])
            }
            if (piece.Blocks.entryIsEnabled(0, 1)) {
                this.Bag.movingPiece.entries.push([i, 1 + CONSTANTS.LEFT_PADDING])
            }
            if (piece.Blocks.entryIsEnabled(0, 2)) {
                this.Bag.movingPiece.entries.push([i, 2 + CONSTANTS.LEFT_PADDING])
            }
            if (piece.Blocks.entryIsEnabled(0, 3)) {
                this.Bag.movingPiece.entries.push([i, 3 + CONSTANTS.LEFT_PADDING])
            }

            i++ 
            m.shift()
        }
        
        this.Bag.movingPiece.pieceRepresentation = piece.TextRepresentation

    }
    
    hardDropActiveEntry() {
        let movedEntries = this.hardDropEntries(this.Bag.movingPiece.entries)
        this.updateGrid(movedEntries)
        this.Bag.movingPiece.reset() // TODO: rename to "clear" instead?
        this.insertPiece(this.Bag.getNextPiece())
    }

    hardDropEntries(entries) {
        let errored = false 
        let movedEntries = entries

        while (!errored) {
            try {
                movedEntries = this.getMovedLREntries(movedEntries, 1, 0)
                this.errorIfNotAllowed(movedEntries)
            }

            catch {
                errored = true 
            }
        }

        movedEntries = this.getMovedLREntries(movedEntries, -1, 0)
        return movedEntries

       
    }


    /**
     * TODO: rename. it's left, right, and down. but LRD is weird.
     * @param {number[]} entries
     * @param {-1 | 0 | 1} dr change in row
     * @param {-1 | 0 | 1} dc change in column
     * @returns 
     */
    getMovedLREntries(entries, dr, dc) {
        // then do the move 

        let plannedEntries = []
        let sortedEntries = sortDoubleArray(entries)

 
        for (let i = 0; i < sortedEntries.length; i++) {
            plannedEntries.push([sortedEntries[i][0] + dr, sortedEntries[i][1] + dc])
        }   
        

        return plannedEntries
    }

    /**
     * 
     * @param {number[]} entries 
     */
    errorIfNotAllowed(entries) {
        for (let i = entries.length - 1; i >= 0; i--) {
            const plannedEntryIsEnabled = this.Grid.entryIsEnabled(entries[i][0], entries[i][1])
            const plannedEntryIsNotApartOfActiveEntry = !this.Bag.movingPiece.entries.some(x => x.toString() == [entries[i][0], entries[i][1]].toString())  // roundabout way of checking if two lists are equal via element comparison

            const plannedEntryInterferes = plannedEntryIsEnabled && plannedEntryIsNotApartOfActiveEntry
            
            if (plannedEntryInterferes) {
                throw new Error("Movement not allowed")
            }
        } 
    }
    /**
     * 
     * @param {number[]} entries 
     */
    updateGrid(entries) {
        // check if can do this move
        this.errorIfNotAllowed(entries)

        // do the move 

        // disable current entires 
        for (let i = 0; i < this.Bag.movingPiece.entries.length; i++) {
            let row = this.Bag.movingPiece.entries[i][0]
            let col = this.Bag.movingPiece.entries[i][1]
            this.Grid.disableEntry(row, col)
        }

        this.Bag.movingPiece.entries = []
        CONSTANTS.DEBUG_LOG(entries)

        // update grid 
        for (let i = 0; i < entries.length; i++) {
            let row = entries[i][0]
            let col = entries[i][1]
            this.Grid.enableEntry(row, col, this.Bag.movingPiece.pieceRepresentation)
            this.Bag.movingPiece.entries.push([row, col])
        }

    }

    /**
     * 
     * @param {MovementWrapper} movement 
     */
    moveActivePiece(movement) {
        try {
            if (movement.getMove() == CONSTANTS.MOVEMENT_TYPES.LEFT) {
                let movedEntries = this.getMovedLREntries(this.Bag.movingPiece.entries, 0, -1)
                this.updateGrid(movedEntries)
            }
            else if (movement.getMove() == CONSTANTS.MOVEMENT_TYPES.RIGHT) {
                let movedEntries = this.getMovedLREntries(this.Bag.movingPiece.entries, 0, 1)
                this.updateGrid(movedEntries)
            }
            else if (movement.getMove() == CONSTANTS.MOVEMENT_TYPES.DOWN) {
                let movedEntries = this.getMovedLREntries(this.Bag.movingPiece.entries, 1, 0)
                this.updateGrid(movedEntries)
            }
        }
        catch (err) {
            CONSTANTS.DEBUG_LOG(`err = ${err}`)
            CONSTANTS.DEBUG_LOG(`this move cannot be made (${movement.getMovementString()})`)
        }
    }

    activePieceIsOnGround() {
        for (let i = this.Bag.movingPiece.entries.length - 1; i >= 0; i--) {
            try {
                this.Grid.entryIsEnabled(this.Bag.movingPiece.entries[i][0] + 1, this.Bag.movingPiece.entries[i][1])
            }
            catch {
                return true; 
            }
        }  
        return false; 
    }

    /**
     * 
     * @param {MovementWrapper} rotation 
     */
    rotateActivePiece(rotation) {
        let newEntries = RotationHandler.getRotatedEntries(rotation, this.Bag.movingPiece.rotationState, this.Bag.movingPiece.entries, this.Bag.movingPiece.pieceRepresentation)

         
        // check if can do spin 
        for (let i = 0; i < newEntries.length; i++) {
            let row = newEntries[i][0]
            let col = newEntries[i][1]

            let pieceIsPartOfActive = false;

            activePieceLoop: 
            for (let j = 0; j < this.Bag.movingPiece.entries.length; j++) {
                let row_j = this.Bag.movingPiece.entries[j][0]
                let col_j = this.Bag.movingPiece.entries[j][1]  

                if (row_j == row && col_j == col) {
                    pieceIsPartOfActive = true
                    break activePieceLoop
                }
            } 


            if (
                this.Grid.entryIsUndefined(row, col) || 
                (this.Grid.entryIsEnabled(row, col) && !pieceIsPartOfActive)
            ) {
                CONSTANTS.DEBUG_LOG("cannot do this spin")
                return; 
            }
        }



        // do spin 

        // disable current entires 
        for (let i = 0; i < this.Bag.movingPiece.entries.length; i++) {
            let row = this.Bag.movingPiece.entries[i][0]
            let col = this.Bag.movingPiece.entries[i][1]
            this.Grid.disableEntry(row, col)
        }

        this.Bag.movingPiece.entries = []

        // update grid 
        for (let i = 0; i < newEntries.length; i++) {
            let row = newEntries[i][0]
            let col = newEntries[i][1]
            this.Grid.enableEntry(row, col, this.Bag.movingPiece.pieceRepresentation)
            this.Bag.movingPiece.entries.push([row, col])
        }

        this.Bag.movingPiece.rotationState.rotateState(rotation)
  
    }

    input(input) {
        if (input == "l") {
            this.moveActivePiece(new MovementWrapper("LEFT"))
        }
        else if (input == "r") {
            this.moveActivePiece(new MovementWrapper("RIGHT"))
        }
        else if (input == "d") {
            this.moveActivePiece(new MovementWrapper("DOWN"))
        }
        else if (input == "h") {
            this.hardDropActiveEntry()
        }
        else if (input == "s") { 
           this.rotateActivePiece(new MovementWrapper("CCW"))
        }
        else if (input == "f") { 
            this.rotateActivePiece(new MovementWrapper("CW"))
        }



        
        if (this.activePieceIsOnGround()) {
            this.Bag.movingPiece.groundHasBeenTouched = true; 
        }
        
        if (this.Bag.movingPiece.groundHasBeenTouched) {
            this.Bag.movingPiece.groundMovesMade++ 
            
            if (this.Bag.movingPiece.groundMovesMade == CONSTANTS.GROUND_MOVES_LIMIT) {
                this.Bag.movingPiece.reset()
                this.insertPiece(this.Bag.getNextPiece())
                
                CONSTANTS.DEBUG_LOG("piece should now be fixed")
                
            }
        }
        
        CONSTANTS.DEBUG_LOG(`ground moves made = ${this.Bag.movingPiece.groundMovesMade}`)
        CONSTANTS.DEBUG_LOG(`is on ground? ${this.activePieceIsOnGround()}`)
    }

}

module.exports = {
    Board
}