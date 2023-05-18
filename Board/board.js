const CONSTANTS = require("../constants")
const { GridHolder } = require("../GridHolder/gridHolder")
const { MovementWrapper } = require("../Movement/movementWrapper")
const { TPiece } = require("../Pieces/t_piece")






class Board {
    constructor(rows, cols) {
        /** @protected {number[]} matrix holder */
        this.Grid = new GridHolder(rows, cols)

        this.leftPadding = 3
        this.groundMovesLimit = 3; // if block has touched the ground, how many times can it be moved further before locking into place

        this.activePiece = {
            entries: [],
            pieceRepresentation: "", 
            pieceState: 0,  // for rotations: -3,-2,-1,0,1,2,3
            groundHasBeenTouched: false, 
            groundMovesMade: 0, 

        }
    }

    /**
     * @returns {void} 
     */
    printBoard() {
        console.log("********")
        this.Grid.printGrid()
        console.log("********")
    }

    /**
     * 
     * @param {TPiece} piece 
     */
    insertPiece(piece) {
        let m = piece.Blocks.Grid 

        // fail check 
        for (let i = 0; i < m.length; i++) {
            if (this.Grid.entryIsEnabled(i, 0 + this.leftPadding)
                || this.Grid.entryIsEnabled(i, 1 + this.leftPadding)
                || this.Grid.entryIsEnabled(i, 2 + this.leftPadding)
            ) {
                console.log("Game End! stopping execution")
                return 
            }
        }


        let i = 0 
        while(m.length != 0) {
            CONSTANTS.DEBUG_LOG(m)

            this.Grid.enableEntry(i, 0 + this.leftPadding, m[0][0] || CONSTANTS.DISABLED_ENTRY_REPRESENTATION)
            this.Grid.enableEntry(i, 1 + this.leftPadding, m[0][1] || CONSTANTS.DISABLED_ENTRY_REPRESENTATION)
            this.Grid.enableEntry(i, 2 + this.leftPadding, m[0][2] || CONSTANTS.DISABLED_ENTRY_REPRESENTATION)
            this.Grid.enableEntry(i, 3 + this.leftPadding, m[0][3] || CONSTANTS.DISABLED_ENTRY_REPRESENTATION)
    

            if (piece.Blocks.entryIsEnabled(0, 0)) this.activePiece.entries.push([i, 0 + this.leftPadding])
            if (piece.Blocks.entryIsEnabled(0, 1)) this.activePiece.entries.push([i, 1 + this.leftPadding])
            if (piece.Blocks.entryIsEnabled(0, 2)) this.activePiece.entries.push([i, 2 + this.leftPadding])
            if (piece.Blocks.entryIsEnabled(0, 3)) this.activePiece.entries.push([i, 3 + this.leftPadding])

            i++ 
            m.shift()
        }
        CONSTANTS.DEBUG_LOG(this.activePiece.entries)
        this.activePiece.pieceRepresentation = piece.TextRepresentation
        this.activePiece.pieceState = 0



    }
    
    hardDropActiveEntry() {
        let errored = false 

        while (!errored) {
            try {
                this.makeMove(0,1)
            }

            catch {
                errored = true 
            }
        }

        // this.activePiece.entries = []

    }

    /**
     * 
     * @param {-1 | 0 | 1} dx 
     * @param {-1 | 0 | 1} dy 
     * @returns 
     */
    makeMove(dx, dy) {
        let temp = dy 
        dy = dx 
        dx = temp

        // var swap for the sake of keeping it intuitive 

        for (let i = this.activePiece.entries.length - 1; i >= 0; i--) {
            const plannedEntryIsEnabled = this.Grid.entryIsEnabled(this.activePiece.entries[i][0] + dx, this.activePiece.entries[i][1] + dy)
            const plannedEntryIsNotApartOfActiveEntry = !this.activePiece.entries.some(x => x.toString() == [this.activePiece.entries[i][0] + dx, this.activePiece.entries[i][1] + dy].toString())  // roundabout way of checking if two lists are equal via element comparison

            const plannedEntryInterferes = plannedEntryIsEnabled && plannedEntryIsNotApartOfActiveEntry
            
            // TODO: handle this better :D   might make it so that nothing happens 
            if (plannedEntryInterferes) {
                // throw new Error("Lowering caused interference; Lowering rejected")
                CONSTANTS.DEBUG_LOG("cannot move")
                return; 
            }
        }  

        // then do the move 
        CONSTANTS.DEBUG_LOG("going to move")
        CONSTANTS.DEBUG_LOG(this.activePiece.entries)

        if (dx == 1 || dy == 1) {
            for (let i = this.activePiece.entries.length - 1; i >= 0; i--) {
                this.Grid.disableEntry(this.activePiece.entries[i][0], this.activePiece.entries[i][1])
                this.Grid.enableEntry(this.activePiece.entries[i][0] + dx, this.activePiece.entries[i][1] + dy, this.activePiece.pieceRepresentation)
                this.activePiece.entries[i] = [this.activePiece.entries[i][0] + dx, this.activePiece.entries[i][1] + dy]
            }   
        }
        else {
            for (let i = 0; i < this.activePiece.entries.length; i++) {
                this.Grid.disableEntry(this.activePiece.entries[i][0], this.activePiece.entries[i][1])
                this.Grid.enableEntry(this.activePiece.entries[i][0] + dx, this.activePiece.entries[i][1] + dy, this.activePiece.pieceRepresentation)
                this.activePiece.entries[i] = [this.activePiece.entries[i][0] + dx, this.activePiece.entries[i][1] + dy]
            }   
        }
    }

    /**
     * 
     * @param {MovementWrapper} movement 
     */
    moveActivePiece(movement) {
        if (movement.getMove() == CONSTANTS.MOVEMENT_TYPES.LEFT) {
            this.makeMove(-1, 0)    
        }
        else if (movement.getMove() == CONSTANTS.MOVEMENT_TYPES.RIGHT) {
            this.makeMove(1, 0)
        }
        else if (movement.getMove() == CONSTANTS.MOVEMENT_TYPES.DOWN) {
            try {
                this.makeMove(0, 1)
            }
            catch {
                CONSTANTS.DEBUG_LOG("cannot make move down")
            }
        }
    }

    activePieceIsOnGround() {
        for (let i = this.activePiece.entries.length - 1; i >= 0; i--) {
            try {
                this.Grid.entryIsEnabled(this.activePiece.entries[i][0] + 1, this.activePiece.entries[i][1])
            }
            catch {
                return true; 
            }
        }  
        return false; 
    }

    rotateActivePiece(rotationType) {
        if (this.activePiece.pieceRepresentation == CONSTANTS.T_PIECE_REPRESENTATION) {
            
        }
        else if (this.activePiece.pieceRepresentation == CONSTANTS.O_PIECE_REPRESENTATION) {

        }
        else if (this.activePiece.pieceRepresentation == CONSTANTS.I_PIECE_REPRESENTATION) {

        }
        else if (this.activePiece.pieceRepresentation == CONSTANTS.J_PIECE_REPRESENTATION) {

        }
        else if (this.activePiece.pieceRepresentation == CONSTANTS.L_PIECE_REPRESENTATION) {

        }
        else if (this.activePiece.pieceRepresentation == CONSTANTS.Z_PIECE_REPRESENTATION) {

        } 
        else if (this.activePiece.pieceRepresentation == CONSTANTS.S_PIECE_REPRESENTATION) {

        }
        
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
        else if (input == "s") { // ccw
            if (this.activePiece.pieceRepresentation == CONSTANTS.T_PIECE_REPRESENTATION) {
                let newEntries = TPiece.rotate(1, 0, this.activePiece.entries)
                CONSTANTS.DEBUG_LOG("new entries = ")
                console.log(newEntries)
                
                // check if can do spin 
                for (let i = 0; i < newEntries.length; i++) {
                    let row = newEntries[i][0]
                    let col = newEntries[i][1]

                    let pieceIsPartOfActive = false;

                    activePieceLoop: 
                    for (let j = 0; j < this.activePiece.entries.length; j++) {
                        let row_j = this.activePiece.entries[j][0]
                        let col_j = this.activePiece.entries[j][1]  

                        if (row_j == row && col_j == col) {
                            pieceIsPartOfActive = true
                            break activePieceLoop
                        }
                    } 


                    if (this.Grid.getEntry(row, col) == undefined || (this.Grid.entryIsEnabled(row, col) && !pieceIsPartOfActive)) {
                        CONSTANTS.DEBUG_LOG("cannot do this spin")
                    }
                }

 

                // do spin 

                // disable current entires 
                for (let i = 0; i < this.activePiece.entries.length; i++) {
                    let row = this.activePiece.entries[i][0]
                    let col = this.activePiece.entries[i][1]
                    this.Grid.disableEntry(row, col)
                }

                this.activePiece.entries = []

                // update grid 
                for (let i = 0; i < newEntries.length; i++) {
                    let row = newEntries[i][0]
                    let col = newEntries[i][1]
                    this.Grid.enableEntry(row, col, CONSTANTS.T_PIECE_REPRESENTATION)
                    this.activePiece.entries.push([row, col])
                }

                this.activePiece.pieceState = (this.activePiece.pieceState + 1) % 4

            }
        }
        else if (input == "f") { // cw

        }


        
        if (this.activePieceIsOnGround()) {
            this.activePiece.groundHasBeenTouched = true; 
        }
        
        if (this.activePiece.groundHasBeenTouched) {
            this.activePiece.groundMovesMade++ 
            
            if (this.activePiece.groundMovesMade == this.groundMovesLimit) {
                
                CONSTANTS.DEBUG_LOG("piece should now be fixed")
            }
        }
        
        CONSTANTS.DEBUG_LOG(`ground moves made = ${this.activePiece.groundMovesMade}`)
        CONSTANTS.DEBUG_LOG(`is on ground? ${this.activePieceIsOnGround()}`)
    }

}

module.exports = {
    Board
}