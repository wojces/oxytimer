const fs = require('fs')

function getUrl() {
  return JSON.parse(fs.readFileSync("config/config.json", { encoding: 'utf8', flag: 'r' })).mongoconn
}

module.exports = getUrl

