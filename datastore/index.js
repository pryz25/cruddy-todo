const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw (err);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          throw err;
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, items) => {
    if (err) {
      throw (err);
    } else {
      callback(null, _.map(items, (id) => {
        return { id: id.slice(0, 5), text: id.slice(0, 5) };
      }));
    }
  });
};
// fs.readFile(FILE_LOCATION, function (err, data) {
//   if (err) throw err;
//   if(data.indexOf('search string') >= 0){
//    console.log(data)
//   }
// });
exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + '/' + id + '.txt', (err, text) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text: text.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.access(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text: text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + '/' + id + '.txt', (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
