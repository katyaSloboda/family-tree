const treesRoutes = require('./trees_routes');
const personsRoutes = require('./persons_routes');
module.exports = function(app, db) {
  treesRoutes(app, db);
  personsRoutes(app, db);
};
