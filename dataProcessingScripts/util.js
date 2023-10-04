const { promises, existsSync } = require('fs')

module.exports.mkdir = function mkdir(directory) {
    const cache = {}
    return new Promise((resolve, reject) => {
        if (cache[directory]) resolve()
        if (!existsSync(directory)) promises.mkdir(directory).then(resolve).catch(reject)
        else resolve()
    })
}