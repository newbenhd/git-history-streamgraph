const { mkdir } = require('./util')
const { promisify } = require('util')
const { exec } = require('child_process')
const depends = require('./depends');

function clone() {
  return new Promise(async (resolve, reject) => {
    try {
      const directory = './repositories'
      await mkdir(directory)
      const repositories = await depends()
      const bar = new (require('progress'))('Cloning [:bar] :rate/bps :percent :etas', {
        total: repositories.length
      })
      const commandPromises = repositories
        .map(gitCloneCommand)
        .map(runCommandPromise({ cwd: directory }, bar.tick.bind(bar, 1)))
      
      await Promise.all(commandPromises)
      resolve()
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
function gitCloneCommand(repo) {
  return `git clone https://github.com/d3/${repo}.git`
}
function runCommandPromise(option, cb) {
  return (command) => Promise.resolve().then(() => promisify(exec)(command, option).then(cb))
}

module.exports = clone