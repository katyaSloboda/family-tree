"use strict";
const ch          = require('./helpers/cheerio_helper');
const express     = require('express');
const bodyParser  = require('body-parser');
const mysql       = require("mysql2");
const app         = express();
const port        = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "familyTreeApp"
});

require('./routes')(app, connection, ch);
app.listen(port, () => {
  console.log('We are live on ' + port);
});
