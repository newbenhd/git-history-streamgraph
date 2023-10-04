const clone = require('./clone');
const knife = require('./knife');
const json = require('./json');
const combine = require('./combine');
const aggregate = require('./aggregate');

Promise.resolve().then(clone).then(knife).then(json).then(combine).then(aggregate)