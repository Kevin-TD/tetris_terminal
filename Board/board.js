const CONSTANTS = require("../constants")
const { GridHandler } = require("../Grid/gridHandler")
const { MovementWrapper } = require("../Movement/movementWrapper")
const { sortDoubleArray } = require("../utils")
const RotationHandler = require("../Pieces/rotation_maps")
const { ScoreHandler } = require("../Score/scoreHandler")
const { BagHandler } = require("../Bag/bagHandler")
const { InputWrapper } = require("../Input/inputWrapper.js")
const { INPUT_TYPES } = require("../constants.js")

const { TPiece } = require("../Pieces/t_piece.js")
const { OPiece } = require("../Pieces/o_piece.js")
const { IPiece } = require("../Pieces/i_piece.js")
const { JPiece } = require("../Pieces/j_piece.js")
const { LPiece } = require("../Pieces/l_piece.js")
const { ZPiece } = require("../Pieces/z_piece.js")
const { SPiece } = require("../Pieces/s_piece.js")


// TODO: make better list comparison function. doing .toStrings is just cringe, it being less optimal aside 
// TODO: when the game ends make sure the last frame shows even if there is a seemingly malformed block 
// TODO: considering adding a "hard drop but not finalize". 


class Board {
    constructor(rows, cols) {
        /** @protected {number[]} matrix holder */
        this.Grid = new GridHandler(rows, cols) // TODO: rename to "handler"?
        this.Bag = new BagHandler()
        this.Score = new ScoreHandler() 
        this.gameIsOver = false 

        this.insertPiece(this.Bag.getNextPiece())

    }

    /**
     * @returns {void} 
     */
    getBoardString() {
        if (this.gameHasEnded()) return this.Grid.getGridString() 

        let ghostEntries = this.hardDropEntries(this.Bag.movingPiece.entries)
        let str = ""

        if (
            !this.Bag.movingPiece.entries.some(x => ghostEntries.some(y => x == y.toString()))
            // TODO: make less cringe ^^^^
        ) { 
            // check if they share no elements

            for (let i = 0; i < ghostEntries.length; i++) {
                let row = ghostEntries[i][0]
                let col = ghostEntries[i][1]
                this.Grid.enableEntry(row, col, CONSTANTS.GHOST_PIECE_REPRESENTATION)
            }

            str = this.Grid.getGridString()

            for (let i = 0; i < ghostEntries.length; i++) {
                let row = ghostEntries[i][0]
                let col = ghostEntries[i][1]
                this.Grid.disableEntry(row, col)
            }
        }
        else {
            str = this.Grid.getGridString() 
        }

        return str 
    }

    gameHasEnded() {
        return this.gameIsOver
    }

    /**
     * 
     * @param {TPiece | OPiece | IPiece | JPiece | LPiece | ZPiece | SPiece} piece 
     */
    insertPiece(piece) {
        let insertedGrid = piece.Blocks.Grid 
        CONSTANTS.DEBUG_LOG("inserted grid = ")
        CONSTANTS.DEBUG_LOG(insertedGrid)


        let i = 0 
        while(insertedGrid.length != 0) {

            if (
                piece.Blocks.entryIsEnabled(0, 0) &&  // check to see if this piece could be added 
                this.Grid.entryIsEnabled(i, 0 + CONSTANTS.LEFT_PADDING) // is this piece interfering with an enabled slot?
            ) {
                this.gameIsOver = true
                return;
            }
            if (
                piece.Blocks.entryIsEnabled(0, 1) &&
                this.Grid.entryIsEnabled(i, 1 + CONSTANTS.LEFT_PADDING) 
            ) {
                this.gameIsOver = true
                return;
            }

            if (
                piece.Blocks.entryIsEnabled(0, 2) &&
                this.Grid.entryIsEnabled(i, 2 + CONSTANTS.LEFT_PADDING) 
                
            ) {
                this.gameIsOver = true
                return;
            }

            if (
                piece.Blocks.entryIsEnabled(0, 3) &&
                this.Grid.entryIsEnabled(i, 3 + CONSTANTS.LEFT_PADDING) 
            ) {
                this.gameIsOver = true
                return;
            }
      

            if (insertedGrid[0][0] != CONSTANTS.DISABLED_ENTRY_REPRESENTATION) this.Grid.enableEntry(i, 0 + CONSTANTS.LEFT_PADDING, insertedGrid[0][0])
            if (insertedGrid[0][1] != CONSTANTS.DISABLED_ENTRY_REPRESENTATION) this.Grid.enableEntry(i, 1 + CONSTANTS.LEFT_PADDING, insertedGrid[0][1])
            if (insertedGrid[0][2] != CONSTANTS.DISABLED_ENTRY_REPRESENTATION) this.Grid.enableEntry(i, 2 + CONSTANTS.LEFT_PADDING, insertedGrid[0][2])
            if (insertedGrid[0][3] != CONSTANTS.DISABLED_ENTRY_REPRESENTATION) this.Grid.enableEntry(i, 3 + CONSTANTS.LEFT_PADDING, insertedGrid[0][3])
    
            
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
            insertedGrid.shift()
        }
        
        this.Bag.movingPiece.pieceRepresentation = piece.TextRepresentation

    }
    
    hardDropActiveEntry() {
        let movedEntries = this.hardDropEntries(this.Bag.movingPiece.entries)
        this.updateGrid(movedEntries)
        this.Bag.movingPiece.clear() 
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
        let ghostEntries = this.hardDropEntries(this.Bag.movingPiece.entries)
        return ghostEntries.toString() == this.Bag.movingPiece.entries.toString()
        // TODO: dies of cringe... 
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

    checkAndClearLines() {
        let rowsToClear = []

        for (let i = 0; i < this.Grid.getRows(); i++) {
            let lineCleared = true 

            iterateColumn:
            for (let j = 0; j < this.Grid.getCols(); j++) {
               if (!this.Grid.entryIsEnabled(i, j)) {
                lineCleared = false
                break iterateColumn
               }
            }

            if (lineCleared) rowsToClear.push(i)
        }

        CONSTANTS.DEBUG_LOG("rows to clear = ")
        CONSTANTS.DEBUG_LOG(rowsToClear)

        let linesCleared = rowsToClear.length

        CONSTANTS.DEBUG_LOG("grid = ")

        // clear lines
        for (let i = 0; i < rowsToClear.length; i++) {
            for (let j = 0; j < this.Grid.getCols(); j++) {
                this.Grid.disableEntry(rowsToClear[i], j)
            }
        }

        this.Score.updateScore(linesCleared)

        // drag down 
        for (let i = rowsToClear[0] - 1; i >= 0; i--) {
            for (let j = 0; j < this.Grid.getCols(); j++) {
               if (this.Grid.entryIsEnabled(i, j)) {
                let pieceRep = this.Grid.getEntry(i, j)
                this.Grid.disableEntry(i, j)
                this.Grid.enableEntry(i + linesCleared, j, pieceRep)
               }
            }
        }

    }

    finalizeActivePiece() {
        CONSTANTS.DEBUG_LOG("before")
        this.hardDropActiveEntry()
        CONSTANTS.DEBUG_LOG("dropped")
        this.Bag.canUseHold = true 
        this.checkAndClearLines()
        CONSTANTS.DEBUG_LOG("checked and cleared")
        this.insertPiece(this.Bag.getNextPiece())
        CONSTANTS.DEBUG_LOG("inserted")
        CONSTANTS.DEBUG_LOG(this.gameHasEnded())

    }
    
    handleIfActivePieceOnGround() {
        if (this.activePieceIsOnGround()) {
            this.Bag.movingPiece.groundHasBeenTouched = true; 
        }
        
        if (this.Bag.movingPiece.groundHasBeenTouched) {
            if (this.activePieceIsOnGround()) this.Bag.movingPiece.groundMovesMade++ 
            
            if (this.Bag.movingPiece.groundMovesMade == CONSTANTS.GROUND_MOVES_LIMIT) {
                this.finalizeActivePiece()
        
                CONSTANTS.DEBUG_LOG("piece should now be fixed")
                
            }
        }
    }

    handleHold() {
        if (!this.Bag.canUseHold) {
            CONSTANTS.DEBUG_LOG("cannot use hold")
        } 

        if (this.Bag.canUseHold) {
            // for wherever the current moving piece is, disable its entries
            for (let i = 0; i < this.Bag.movingPiece.entries.length; i++) {
                let row = this.Bag.movingPiece.entries[i][0]
                let col = this.Bag.movingPiece.entries[i][1]
                this.Grid.disableEntry(row, col)
            }

            if (!this.Bag.holdPieceExists()) {
                this.Bag.holdPiece(this.Bag.movingPiece.pieceRepresentation)
                this.Bag.movingPiece.clear()
                this.insertPiece(this.Bag.getNextPiece())
            }
            else {
                let pieceRep = this.Bag.movingPiece.pieceRepresentation
                this.Bag.movingPiece.clear()
                this.insertPiece(this.Bag.getHoldPiece())
                this.Bag.holdPiece(pieceRep)
            }

            this.Bag.canUseHold = false 
        }
    }

    /**
     * 
     * @param {InputWrapper} input 
     */
    input(input) {
        switch (input.getInput()) {
            case INPUT_TYPES.MOVE_LEFT:
                this.moveActivePiece(new MovementWrapper("LEFT"))
                break

            case INPUT_TYPES.MOVE_RIGHT:
                this.moveActivePiece(new MovementWrapper("RIGHT"))
                break

            case INPUT_TYPES.ROTATE_CCW:
                this.rotateActivePiece(new MovementWrapper("CCW"))
                break

            case INPUT_TYPES.ROTATE_CW:
                this.rotateActivePiece(new MovementWrapper("CW"))
                break

            case INPUT_TYPES.MOVE_DOWN_1:
                this.moveActivePiece(new MovementWrapper("DOWN"))
                break

            case INPUT_TYPES.HARD_DROP_AND_FINALIZE:
                this.finalizeActivePiece()
                CONSTANTS.DEBUG_LOG("i finalized the piece")
                break 

            case INPUT_TYPES.HARD_DROP_DO_NOT_FINALIZE:
                let movedEntries = this.hardDropEntries(this.Bag.movingPiece.entries)
                this.updateGrid(movedEntries)
                break 

            case INPUT_TYPES.HOLD_PIECE:
                this.handleHold()
                break
            
            case INPUT_TYPES.QUIT:
                this.gameIsOver = true 
                break 
        }
        
        if (this.gameHasEnded()) {
            CONSTANTS.DEBUG_LOG('GAME HAS ENDED!')
            return
        }

        this.handleIfActivePieceOnGround()
        
    }

}

module.exports = {
    Board
}