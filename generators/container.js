var path = require('path');

module.exports = function (utils, name, base) {
  return utils.src.read('./templates/container.js').then(function (output) {
    return utils.target.write(path.resolve('./src/containers', name + '.js'), output, {
      name: name,
    });
  });
}
