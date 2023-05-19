/**
 * 
 * @param {number[]} arr 
 * @returns {number[]}
 */
function sortDoubleArray(arr) {
    let rowVals = []
    let colVals = []
    let res = []
    let map = {}
    for (let i = 0; i < arr.length; i++) {
        rowVals.push(arr[i][0])
        colVals.push(arr[i][1]) 
        if (map[arr[i][0]] == undefined) map[arr[i][0]] = []
        map[arr[i][0]].push(arr[i][1]) 
    }
    for (let key of Object.keys(map)) {
        map[key].sort()
    }
    for (let key of Object.keys(map)) {
        for (let i of map[key]) {
            res.push([parseInt(key), i])
        }
    }
    return res 
}

module.exports = {
    sortDoubleArray
}