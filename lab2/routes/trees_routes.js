"use strict";
let ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db, ch) {
  // Get main page
  app.get('/', (req, res) => {
    res.render('index');
  });

  // Create tree
  app.post('/', (req, res) => {
    if (!req.body) return res.sendStatus(400);
    const tree = { name: req.body.name };
    db.collection('trees').insertOne(tree, (err, result) => {
      if (err) throw err;
      res.redirect('/trees');
    });
  });

  // Get trees
  app.get('/trees', (req, res) => {
    db.collection('trees').find({}).toArray((err, items) => {
      if (err) throw err;
      res.render('trees', { items: items });
    });
  });

  // Get tree
  app.get('/tree/:id', (req, res) => {
    const tdetails = { '_id': new ObjectID(req.params.id) };
    const pdetails = { 'treeId': req.params.id };
    db.collection('trees').findOne(tdetails, (err, tree) => {
      if (err) throw err;
      db.collection('persons').find(pdetails).toArray((err, persons) => {
        if (err) throw err;
        persons.sort(function(p1, p2) { return new Date(p1.dateOfBirth) -
                                               new Date(p2.dateOfBirth); });
        res.render('tree', { tree: tree, persons: persons });
      });
    });
  });

  // Delete tree
  app.post('/delete-tree', (req, res) => {
    const id = req.body.id;
    const tdetails = { '_id': new ObjectID(id) };
    const pdetails = { 'treeId': new ObjectID(id) };
    db.collection('persons').deleteMany(pdetails, (err, item) => {
      if (err) throw err;
    });
    db.collection('trees').deleteOne(tdetails, (err, item) => {
      if (err) throw err;
      res.json(id);
    });
  });

  // Get tree for Edit page
  app.get('/edit-tree/:id', (req, res) => {
    const details = { '_id': new ObjectID(req.params.id) };
    db.collection('trees').findOne(details, (err, tree) => {
      if (err) throw err;
      res.render('tree-edit', { tree: tree });
    });
  });

  // Update tree
  app.post('/edit-tree/:id', (req, res) => {
    const id = req.params.id;
    const details = { '_id': new ObjectID(id) };
    const tree = { name: req.body.name };
    db.collection('trees').update(details, tree, (err, result) => {
      if (err) throw err;
      res.redirect('/trees');
    });
  });
};
