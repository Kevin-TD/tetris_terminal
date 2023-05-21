const { INPUT_TYPES } = require("../constants.js")

class InputWrapper {
    constructor(input) {
        if (INPUT_TYPES[input] == undefined) {
            throw new Error(`Invalid construction of Input using input = ${input}. input must be from INPUT_TYPES, which are ${Object.keys(INPUT_TYPES).toString()}`)
        }
        this.input = INPUT_TYPES[input]
    }

    getInputString() {
        for (let key of Object.keys(INPUT_TYPES)) {
            if (INPUT_TYPES[key] == this.input) {
                return key 
            }
        }
    }

    getInput() {
        return this.input 
    }
    
}

module.exports = {
    InputWrapper
}