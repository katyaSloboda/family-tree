const express     = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser  = require('body-parser');
const db          = require('./config/db');
const app         = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

MongoClient.connect(db.url, { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;
  var db = client.db('familyTreeApp');
  require('./routes')(app, db);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });
});
