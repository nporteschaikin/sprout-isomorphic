var path = require('path');

module.exports = function (utils, name, base) {
  return utils.src.read('./templates/action.js').then(function (output) {
    return utils.target.write(path.resolve('./src/actions', name + '.js'), output, {
      name: name,
    });
  });
}
