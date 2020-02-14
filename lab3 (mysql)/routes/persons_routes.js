"use strict";
module.exports = function(app, connection, ch) {
  // Get person
  app.get('/person/:id', (req, res) => {
    const wfilter = [req.params.id, req.query.treeId, 1];
    const mfilter = [req.params.id, req.query.treeId, 0];
    const sql = "SELECT * FROM all_persons WHERE id<>? AND treeId=? AND gender=?";

    connection.query(sql, wfilter, (err, women) => {
      if(err) throw err;
      connection.query(sql, mfilter, (err, men) => {
        if(err) throw err;

        women.unshift({ id: null, firstName: "None" });
        men.unshift({ id: null, firstName: "None" });

        if (req.params.id == 0) {
          res.render('person', { person: { id: 0, treeId: req.query.treeId }, women: women, men: men });
        } else {
          const filter = [req.params.id];
          const sql = "SELECT * FROM all_persons WHERE id=?";
          connection.query(sql, filter, (err, results) => {
            if(err) throw err;
            res.render('person', { person: results[0], women: women, men: men });
          });
        }
      });
    });
  });

  // Update person
  app.post('/edit-person/:id', (req, res) => {
    const data = [req.body.firstName,
                  req.body.lastName,
                  req.body.middleName,
                  req.body.dateOfBirth || null,
                  req.body.dateOfDeath || null,
                  req.body.gender || 0,
                  req.body.motherId || null,
                  req.body.fatherId || null,
                  req.body.treeId,
                  req.params.id];

    if (req.params.id == 0) {
      const sql = `CALL insert_person(?,?,?,?,?,?,?,?,?)`;
      connection.query(sql, data, (err, results) => {
          if(err) throw err;
          res.redirect('/tree/' + req.body.treeId);
      });
    } else {
      const sql = `CALL update_person(?,?,?,?,?,?,?,?,?,?)`;
      connection.query(sql, data, (err, results) => {
        if(err) throw err;
        res.redirect('/tree/' + req.body.treeId);
      });
    }
  });

  // Delete person
  app.get('/delete-person/:id/:treeId', (req, res) => {
    const data = [req.params.id];
    const sql = "CALL delete_person(?)";
    connection.query(sql, data, (err, results) => {
      if(err) throw err;
      res.redirect('/tree/' + req.params.treeId);
    });
  });

  // Get person info
  app.get('/get-person-info/:id', (req, res) => {
    const filter = [req.params.id];
    const sql = "SELECT * FROM all_persons WHERE id=?";
    connection.query(sql, filter, (err, results) => {
      if(err) throw err;

      let person = results[0];
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
