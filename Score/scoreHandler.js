class ScoreHandler {
    constructor() {
        this.score = 0 
    }

    /**
     * 
     * @param {number} linesCleared 
     */
    updateScore(linesCleared) {

        switch (linesCleared) {
            case 1:
                this.score += 100 
                break
            case 2:
                this.score += 400
                break
            case 3: 
                this.score += 1600
                break
            case 4:
                this.score += 3200
        }

    }

    getScore() {
        return this.score
    }
}

module.exports = {
    ScoreHandler
}