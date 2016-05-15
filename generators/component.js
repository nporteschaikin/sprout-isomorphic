var path = require('path');

module.exports = function (utils, name, base) {
  return utils.src.read('./templates/component.js').then(function (output) {
    return utils.target.write(path.resolve('./src/components', name + '.js'), output, {
      name: name,
    });
  });
}
