const fs = require('fs');

var noop = () => {};
// @param cacheLocation: The location of the file
// @param timeDelta: How long until the cache is invalid
var EasyCache = function(cacheLocation, timeDelta) {
  this.cacheLocation = cacheLocation;
  this.timeDelta = timeDelta;
};

// @param newTime: The time in milliseconds
// Fetches a cache if cache is new enough or is forced, else returns false
EasyCache.prototype.fetch = function(newTime, force) {
  try {
    // If file exists, read the cache data, and if it's new enough, return it
    let stat = fs.statSync(this.cacheLocation);
      if(stat.isFile()) {
      var jsonData = JSON.parse(fs.readFileSync(this.cacheLocation));
      if ((parseInt(jsonData.cacheTime) + this.timeDelta > newTime) || force) {
          return jsonData.payload;
      }
    }
  } catch (e) {}
  return false;
};

// Async writes data to file
EasyCache.prototype.write = function(newTime, data, cb) {
  cb = cb || noop;

  fs.writeFile(this.cacheLocation, JSON.stringify({
    cacheTime: newTime,
    data: data
  }), cb);
}

// Sync writes data to file
EasyCache.prototype.writeSync = function(newTime, data) {
  fs.writeFileSync(this.cacheLocation, JSON.stringify({
    cacheTime: newTime,
    data: data
  }));
}

// Simple factory
function ec(cacheLocation, timeDelta) {
  return new EasyCache(cacheLocation, timeDelta);
};

module.exports = ec;
