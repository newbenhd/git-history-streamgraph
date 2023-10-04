let { promises } = require('fs');
const depends = require('./depends');

// const json = () => {
//   depends.forEach((repo) => {
//     let txt = fs.readFileSync(`data/${repo}.001.🔪sv`).toString();
//     lines = txt.split('☕');
//     commits = lines.slice(1).map((line) => {
//       let l = line.split('🔪');
//       return {
//         //hash: l[0],
//         date: l[1],
//         author: l[2],
//         //subject: l[3],
//         //body: l[4]
//       };
//     });
//     fs.writeFileSync(`data/${repo}.001.json`, JSON.stringify(commits));
//   });
// };
function json() {
  return new Promise(async (resolve, reject) => {
    try {
      const repositories = await depends()
      const bar = new (require('progress'))('Formatting to JSON [:bar] :rate/bps :percent :etas', {
        total: repositories.length
      })
      await Promise.all(repositories.map((repo) => readFile(repo, bar.tick.bind(bar, 1))))
      resolve()
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
function readFile(repo, cb) {
  return Promise.resolve()
    .then(() => promises.readFile(`data/${repo}.001.🔪sv`))
    .then(content => Promise.resolve(content.toString().split('☕')))
    .then(lines =>
      Promise.resolve(lines.slice(1).map(line => {
        let l = line.split('🔪')
        return {
          //hash: l[0],
          date: l[1],
          author: l[2],
          //subject: l[3],
          //body: l[4]               
        }
      }))
    )
    .then(commits => promises.writeFile(`data/${repo}.001.json`, JSON.stringify(commits)))
    .then(cb)
}

module.exports = json;
