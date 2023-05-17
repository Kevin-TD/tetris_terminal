class GridHolder {
    constructor(rows, cols) {
        /** @protected {number[]} matrix holder */
        this.Grid = []

        
        /** @protected {number} */
        this.rows = rows

        /** @protected {number} */
        this.cols = cols 

        for (let i = 0; i < rows; i++) {
            this.Grid.push([])

            for (let j = 0; j < cols; j++)
                this.Grid[i].push(DISABLED_ENTRY_REPRESENTATION)
        }
    }

    getRows() {
        return this.rows;
    }

    getCols() {
        return this.cols; 
    }

    /**
     * @returns {void} 
     */
    printGrid() {
        for (let i = 0; i < this.rows; i++)  {
            let curRow = this.Grid[i].join("")
            console.log(curRow)
        }
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @returns {boolean}
     */
    entryIsEnabled(row, col) {
        return this.Grid[row][col] != DISABLED_ENTRY_REPRESENTATION
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @param {string} entry 
     * @returns {void}
     */
    enableEntry(row, col, entry) {
        this.Grid[row][col] = entry
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @param {number} num 
     * @returns {void}
     */
    disableEntry(row, col) {
        this.Grid[row][col] = DISABLED_ENTRY_REPRESENTATION
    }
}

module.exports = {
    GridHolder
}