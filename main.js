const GAME_CONSTANTS = require("./constants.js")
const { MovementWrapper } = require("./movementWrapper.js")
const { GridHolder } = require("./gridHolder.js")
const prompt = require("prompt-sync")({ sigint: true })


class Board {
    constructor(rows, cols) {
        /** @protected {number[]} matrix holder */
        this.Grid = new GridHolder(rows, cols)

        this.leftPadding = 3

        this.activePiece = {
            entries: [],
            pieceRepresentation: "", 
            pieceState: 0,  // for rotations: -3,-2,-1,0,1,2,3
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
            DEBUG_LOG(m)

            this.Grid.enableEntry(i, 0 + this.leftPadding, m[0][0] || DISABLED_ENTRY_REPRESENTATION)
            this.Grid.enableEntry(i, 1 + this.leftPadding, m[0][1] || DISABLED_ENTRY_REPRESENTATION)
            this.Grid.enableEntry(i, 2 + this.leftPadding, m[0][2] || DISABLED_ENTRY_REPRESENTATION)
            this.Grid.enableEntry(i, 3 + this.leftPadding, m[0][3] || DISABLED_ENTRY_REPRESENTATION)
    

            if (piece.Blocks.entryIsEnabled(0, 0)) this.activePiece.entries.push([i, 0 + this.leftPadding])
            if (piece.Blocks.entryIsEnabled(0, 1)) this.activePiece.entries.push([i, 1 + this.leftPadding])
            if (piece.Blocks.entryIsEnabled(0, 2)) this.activePiece.entries.push([i, 2 + this.leftPadding])
            if (piece.Blocks.entryIsEnabled(0, 3)) this.activePiece.entries.push([i, 3 + this.leftPadding])

            i++ 
            m.shift()
        }
        DEBUG_LOG(this.activePiece.entries)
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
                DEBUG_LOG("cannot move")
                return; 
            }
        }  

        // then do the move 
        DEBUG_LOG("going to move")
        DEBUG_LOG(this.activePiece.entries)

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
        if (movement.getMove() == MOVEMENT_TYPES.LEFT) {
            this.makeMove(-1, 0)
        }
        else if (movement.getMove() == MOVEMENT_TYPES.RIGHT) {
            this.makeMove(1, 0)
        }
        else if (movement.getMove() == MOVEMENT_TYPES.DOWN) {
            try {
                this.makeMove(0, 1)
            }
            catch {
                DEBUG_LOG("cannot make move down")
            }
        }
    }
}

const Pieces = {
    T: 0, 
    O: 1, 
    I: 2, 
    J: 3, 
    L: 4, 
    Z: 5,
    S: 6
}

const RotationType = {
    CCW: 1,
    CW: -1
}

function getNextPieceState(currentPieceState, rotationType) {
    if (rotationType == RotationType[CCW]) {
        return (currentPieceState + 1) % 4
    }

    if (rotationType == RotationType[CW]) {
        return (currentPieceState - 1) % 4
    }
}


class TPiece  {
    constructor() {
        this.Blocks = new GridHolder(3,4)
        this.TextRepresentation = "🟪"

        this.Blocks.enableEntry(1, 0, this.TextRepresentation)
        this.Blocks.enableEntry(1, 1, this.TextRepresentation)
        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(1, 2, this.TextRepresentation)
    }
}

class OPiece  {
    constructor() {
        this.Blocks = new GridHolder(3,4)
        this.TextRepresentation = "🟨"

        this.Blocks.enableEntry(0, 0, this.TextRepresentation)
        this.Blocks.enableEntry(1, 0, this.TextRepresentation)
        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(1, 1, this.TextRepresentation)
    }
}

class IPiece  {
    constructor() {
        this.Blocks = new GridHolder(3,4)
        this.TextRepresentation = "🟦"

        this.Blocks.enableEntry(0, 0, this.TextRepresentation)
        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(0, 2, this.TextRepresentation)
        this.Blocks.enableEntry(0, 3, this.TextRepresentation)
    }
}

class JPiece  {
    constructor() {
        this.Blocks = new GridHolder(3,4)
        this.TextRepresentation = "⬜"

        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(1, 1, this.TextRepresentation)
        this.Blocks.enableEntry(2, 1, this.TextRepresentation)
        this.Blocks.enableEntry(2, 0, this.TextRepresentation)
    }
}

class LPiece  {
    constructor() {
        this.Blocks = new GridHolder(3,4)
        this.TextRepresentation = "🟧"

        this.Blocks.enableEntry(0, 0, this.TextRepresentation)
        this.Blocks.enableEntry(1, 0, this.TextRepresentation)
        this.Blocks.enableEntry(2, 0, this.TextRepresentation)
        this.Blocks.enableEntry(2, 1, this.TextRepresentation)
    }
}

class ZPiece  {
    constructor() {
        this.Blocks = new GridHolder(3,4)
        this.TextRepresentation = "🟥"

        this.Blocks.enableEntry(0, 0, this.TextRepresentation)
        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(1, 1, this.TextRepresentation)
        this.Blocks.enableEntry(1, 2, this.TextRepresentation)
    }
}

class SPiece  {
    constructor() {
        this.Blocks = new GridHolder(3,4)
        this.TextRepresentation = "🟩"

        this.Blocks.enableEntry(1, 0, this.TextRepresentation)
        this.Blocks.enableEntry(1, 1, this.TextRepresentation)
        this.Blocks.enableEntry(0, 1, this.TextRepresentation)
        this.Blocks.enableEntry(0, 2, this.TextRepresentation)
    }
}


// rows 16 to 24  
// cols typically 10 

// T, O, I, J, L, Z, S

let Game = new Board(16, 10) 
Game.insertPiece(new SPiece())

Game.printBoard()
let input = prompt("Insert input (l - left, r - right, d - down, h - hard drop, q - quit): ")
while (input != "q") {
    console.log(input)

    if (input == "l") {
        Game.moveActivePiece(new MovementWrapper("LEFT"))
    }
    else if (input == "r") {
        Game.moveActivePiece(new MovementWrapper("RIGHT"))
    }
    else if (input == "d") {
        Game.moveActivePiece(new MovementWrapper("DOWN"))
    }
    else if (input == "h") {
        Game.hardDropActiveEntry()
    }


    Game.printBoard()

    input = prompt("Insert input (l - left, r - right, d - down, h - hard drop, q - quit): ")
}


