const treesRoutes = require('./trees_routes');
const personsRoutes = require('./persons_routes');
const articlesRoutes = require('./articles_routes');
module.exports = function(app, db, ch) {
  treesRoutes(app, db, ch);
  personsRoutes(app, db, ch);
  articlesRoutes(app, db, ch);
};
