const { promises } = require('fs');
const depends = require('./depends');

function combine() {
  return new Promise(async (resolve, reject) => {
    const commits = []
    const repositories = await depends()
    const bar = new (require('progress'))('Combining [:bar] :rate/bps :percent :etas', {
      total: repositories.length
    })
    const formatters = repositories.map(repo => Promise.resolve().then(() => 
        promises.readFile(`data/${repo}.001.json`)
      ).then(buffer => Promise.resolve(JSON.parse(buffer.toString()).map(json => ({ ...json, repo }))))
      .then(result => commits.push(...result))
      .then(bar.tick.bind(bar, 1))
    )
    await Promise.all(formatters)
    promises.writeFile('data/all-d3-commits.json', JSON.stringify(commits)).then(resolve).catch(reject)
  })
}

module.exports = combine;
