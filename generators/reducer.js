var path = require('path');

module.exports = function (utils, name, base) {
  return utils.src.read('./templates/reducer.js').then(function (output) {
    return utils.target.write(path.resolve('./src/reducers', name + '.js'), output, {
      name: name,
    });
  });
}
