module.exports = function promiseDependencies() {
    const cache = {}
    return new Promise(async (resolve, reject) => {
        if (cache['repositories']) resolve(cache['repositories'])
        try {
            const { promises } = require('fs');
            const packageText = await promises.readFile('./d3Package.json')
            const packageJson = JSON.parse(packageText.toString());
            const depends = ['d3', ...Object.keys(packageJson.dependencies)];
            cache['repositories'] = depends
            resolve(depends)
        } catch (error) {
            console.error(error)
        }
    })
}