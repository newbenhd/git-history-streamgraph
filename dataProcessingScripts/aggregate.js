const { promises } = require('fs');
const d3 = require('d3');
const {
  timeParse,
  timeFormat,
  utcWeek,
  utcWeeks,
  group,
  extent,
} = d3;

const parseDate = timeParse('%Y-%m-%d');
const formatDate = timeFormat('%Y-%m-%d');

const layer = (d) => d.repo;

function aggregate() {
  return new Promise(async (resolve, reject) => {
    // Load all commits.
    const dataString = await promises.readFile('data/all-d3-commits.json');
    const data = JSON.parse(dataString);

    data.forEach((d) => {
      d.date = utcWeek.floor(parseDate(d.date.split(' ')[0]));
    });

    // Aggregate by week and repository.
    const groupedData = group(data, (d) => d.date, layer);

    const layerGroupedData = group(data, layer);

    const layers = Array.from(layerGroupedData.keys());

    const [start, stop] = extent(data, (d) => d.date);
    const allWeeks = utcWeeks(start, stop);

    const dataBylayer = new Map();

    const aggregatedData = {
      dates: allWeeks.map((d) => formatDate(d)),
      repositories: {},
    };

    for (let layer of layers) {
      const layerData = allWeeks.map((date) => {
        const value = groupedData.get(date);
        const commits = value ? value.get(layer) : null;
        const commitCount = commits ? commits.length : 0;
        return commitCount;
      });
      aggregatedData.repositories[layer] = layerData;
    }

    promises.writeFile(
      '../docs/aggregatedData.json',
      JSON.stringify(aggregatedData)
    ).then(resolve).catch(reject);
  })

};

module.exports = aggregate;
