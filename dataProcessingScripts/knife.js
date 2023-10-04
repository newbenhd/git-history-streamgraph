const { exec } = require('child_process');
const { promisify } = require('util')
const depends = require('./depends');
const { mkdir } = require('./util')


function knife() {
  return new Promise(async (resolve, reject) => {
    try {
      await mkdir('./data')
      const repositories = await depends()
      const bar = new (require('progress'))('Knifing [:bar] :rate/bps :percent :etas', {
        total: repositories.length
      })
      const runCommands = repositories.map(getCommand)
                                   .map(runCommand(bar.tick.bind(bar, 1)))
      await Promise.all(runCommands)
      resolve()
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
function getCommand(repo) {
  return `cd repositories/${repo}; git log --pretty=format:"☕%h🔪%ad🔪%an🔪%s🔪%b" --date="iso" --no-merges --compact-summary > ../../data/${repo}.001.🔪sv`;
}
function runCommand(cb) {
  return (command) => Promise.resolve().then(() => promisify(exec)(command).then(cb))
}

module.exports = knife;
