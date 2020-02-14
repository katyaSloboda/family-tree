"use strict";
let ObjectID = require('mongodb').ObjectID;
module.exports = function(app, db, ch) {
  // Get person
  app.get('/person/:id', (req, res) => {
    const wdetails = { 'treeId': req.query.treeId, 'gender': 1 }
    const mdetails = { 'treeId': req.query.treeId, 'gender': 0 }
    db.collection('persons').find(wdetails).toArray((err, women) => {
      if (err) throw err;
      db.collection('persons').find(mdetails).toArray((err, men) => {
        if (err) throw err;

        women = women.filter((n) => { return n._id != req.params.id; });
        men = men.filter((n) => { return n._id != req.params.id; });
        women.unshift({ _id: 0, firstName: "None" })
        men.unshift({ _id: 0, firstName: "None" })

        if (req.params.id == 0) {
          res.render('person', { person: { _id: 0, treeId: req.query.treeId },
                                 women: women,
                                 men: men });
        } else {
          const details = { '_id': new ObjectID(req.params.id) };
          db.collection('persons').findOne(details, (err, person) => {
            if (err) throw err;
            res.render('person', { person: person, women: women, men: men });
          });
        }
      });
    });
  });

  // Update person
  app.post('/edit-person/:id', (req, res) => {
    const person = { firstName: req.body.firstName,
                     lastName: req.body.lastName,
                     middleName: req.body.middleName,
                     dateOfBirth: req.body.dateOfBirth,
                     dateOfDeath: req.body.dateOfDeath,
                     gender: req.body.gender,
                     motherId: req.body.motherId,
                     fatherId: req.body.fatherId,
                     treeId: req.body.treeId };

    if (req.params.id == 0) {
      db.collection('persons').insertOne(person, (err, result) => {
        if (err) throw err;
        res.redirect('/tree/' + req.body.treeId);
      });
    } else {
      const id = req.params.id;
      const details = { '_id': new ObjectID(id) };
      db.collection('persons').update(details, person, (err, result) => {
        if (err) throw err;
        res.redirect('/tree/' + req.body.treeId);
      });
    }
  });

  // Delete person
  app.get('/delete-person/:id/:treeId', (req, res) => {
    const id = req.params.id;
    const treeId = req.params.treeId;
    const details = { '_id': new ObjectID(id) };
    db.collection('persons').deleteMany(details, (err, item) => {
      if (err) throw err;
      res.redirect('/tree/' + treeId);
    });
  });

  // Get person info
  app.get('/get-person-info/:id', (req, res) => {
    const details = { '_id': new ObjectID(req.params.id) };
    db.collection('persons').findOne(details, (err, person) => {
      if (err) throw err;

      let searchTerm = encodeURI(person.firstName + "+" + person.lastName);
      let searchUrl = 'https://www.google.com/search?q=' + searchTerm + '&tbm=nws';

      ch.getPersonInfo(searchUrl).then(result => {
        res.render('person-info', { links: result });
      }).catch(e => {
        res.render('person-info', { links: [{ text: e }] });
      });
    });
  });
};
