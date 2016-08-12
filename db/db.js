const pgp = require('pg-promise')();
const db = pgp('postgres://Wolphox@localhost:5432/graffiti');
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const salt = bcrypt.genSalt(10);

var login = function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;
  var auth_error = 'Incorrect Email / Password!';

  db.one(
    "SELECT * FROM users WHERE email = $1",
    [email]
  ).catch(function(){
    res.error = auth_error;
    next();
  }).then(function(user){
    bcrypt.compare(
      password,
      user.password_digest,
      function(err, cmp){
        if(cmp){
          req.session.user = {
            'email': user.email
          };
          next();
        } else {
          res.error = auth_error;
          next();
        }
      }
    );
  });
};

var logout = function(req, res, next){
  req.session.user = null;
  next()
};

var create_user = function(req, res, next){
  var email = req.body.email;
  var password = req.body.password;

  bcrypt.hash(password, 10, function(err, hashed_password){
    db.none(
      "INSERT INTO users (email, password_digest) VALUES ($1, $2)",
      [email, hashed_password]
    ).catch(function(){
      res.error = 'Error. User could not be created.';
      next();
    }).then(function(user){
      req.session.user = {
        'email': email
      };
      next();
    });
  });
};

var saveGraffiti = function (req,res, next){
  var data = req.body;
  console.log(data.image);
  console.log('saving picture...');
  //db.none("INSERT INTO publicGraffiti(grid_block, imageURL) VALUES($1, $2)",["1a", data.image])
  //db.none("UPDATE publicGraffiti SET imageURL = $2 WHERE grid_block = $1",["1a", data.image])
  db.none("UPDATE publicGraffiti SET imageURL = $2 WHERE grid_block = $1",["1a", data.image]).then(function(data)
  {
    console.log('picture saved!')
    res.end();
  })
}

var loadGraffiti = function (req,res,next)
{
  console.log('loading picture...');
  db.one("SELECT * FROM publicGraffiti WHERE grid_block='1a'").then(function(data)
  {
    res.send(data);
    console.log('picture loaded!')
    console.log(data);
    res.end();
  })
}


// module.exports = { login, logout, create_user };
module.exports = { login, logout, create_user,loadGraffiti,saveGraffiti };

