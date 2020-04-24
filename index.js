const express = require('express');
var session = require('express-session')
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

app.use(express.static(__dirname + '/public'));

app.use('/', require('./controller/userController'));


app.listen(3000);
console.log("app listening on port 3000")