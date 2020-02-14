"use strict";
module.exports = function(app, db, ch) {
  app.get('/articles', (req, res) => {
    res.render('articles');
  });

  // Get article by url
  app.post('/articles', (req, res) => {
    ch.getTextFromWiki(encodeURI(req.body.url)).then(result => {
      res.json(result);
    }).catch(e => {
      res.json(e); });
  });
};
