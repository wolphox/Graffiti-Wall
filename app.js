const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const flash = require('connect-flash');
const pgp = require('pg-promise')();

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false, limit:'1000mb'}));
app.use(bodyParser.json({ extended: false, limit:'1000mb'}));

app.use(session({
  secret: 'demo-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(flash());

// app.listen(3000, function () {
//   console.log('Auth Demo App Online!');
// });

app.set('port',(process.env.PORT || 3000));

app.listen(app.get('port'), function() {
  console.log('node app is running on port', app.get('port'));
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
});

const router = require('./router')(app);
