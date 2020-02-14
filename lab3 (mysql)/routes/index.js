const treesRoutes = require('./trees_routes');
const personsRoutes = require('./persons_routes');
const articlesRoutes = require('./articles_routes');
module.exports = function(app, connection, ch) {
  treesRoutes(app, connection, ch);
  personsRoutes(app, connection, ch);
  articlesRoutes(app, connection, ch);
};
