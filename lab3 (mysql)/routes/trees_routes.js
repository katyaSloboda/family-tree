"use strict";
module.exports = function(app, connection, ch) {
  // Get main page
  app.get('/', (req, res) => {
    res.render('index');
  });

  // Create tree
  app.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const data = [req.body.tname];
    const sql = `CALL insert_tree(?)`;
    connection.query(sql, data, (err, results) => {
        if(err) throw err;
        res.redirect('/trees');
    });
  });

  // Get trees
  app.get('/trees', (req, res) => {
    const sql = "SELECT * FROM all_trees";
    connection.query(sql, (err, results) => {
        if(err) throw err;
        res.render('trees', { items: results });
    });
  });

  // Get tree
  app.get('/tree/:id', (req, res) => {
    const filter = [req.params.id];
    const selectTreeSql = "SELECT * FROM all_trees WHERE id=?";
    const selectPersonsSql = "SELECT * FROM all_persons WHERE treeId=? ORDER BY dateOfBirth";
    connection.query(selectTreeSql, filter, (err, trees) => {
      if(err) throw err;
      connection.query(selectPersonsSql, filter, (err, persons) => {
        if(err) throw err;
        persons.sort(function(p1, p2) { return new Date(p1.dateOfBirth) -
                                               new Date(p2.dateOfBirth); });
        res.render('tree', { tree: trees[0], persons: persons });
      });
    });
  });

  // Delete tree
  app.post('/delete-tree', (req, res) => {
    const data = [req.body.id];
    const sql = `CALL delete_tree(?)`;
    connection.query(sql, data, (err, results) => {
      if(err) throw err;
      res.json(req.body.id);
    });
  });

  // Get tree for Edit page
  app.get('/edit-tree/:id', (req, res) => {
    const filter = [req.params.id];
    const sql = "SELECT * FROM all_trees WHERE id=?";
    connection.query(sql, filter, (err, results) => {
      if(err) throw err;
      res.render('tree-edit', { tree: results[0] });
    });
  });

  // Update tree
  app.post('/edit-tree/:id', (req, res) => {
    const data = [req.params.id, req.body.tname];
    const sql = `CALL update_tree(?,?)`;
    connection.query(sql, data, (err, results) => {
      if(err) throw err;
      res.redirect('/trees');
    });
  });
};
