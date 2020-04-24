const express = require('express');
const app = express();
const router = express.Router();
const db = require('../models/db');
const User = db.User;
// const path = require('path');
const userService = require('../service/userService');

// router.post('/register', register);
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
// router.post('/register', register);

let sess;

module.exports = router;

function register(req, res, next) {
  console.log('req in register', req.body);
  userService.create(req.body)
    .then((resp) => res.json({ status: 'success'}))
    .catch(err => {
      if(err == 'password and confirm password must be same'){
        res.json({ status: 'password and confirm password must be same'})
      } else if ( err == req.body.email + ' is already taken' ) {
        res.json({ status: 'email already exist'})
      }
    });
}

function login(req, res, next) {
  console.log('req in login', req.body);
  userService.login(req.body)
    .then((resp) => {
      req.session.user = resp;
      res.json({ status: 'success' })
    })
    .catch(err => {
      if (err == 'incorrect password') {
        res.json({ status: 'incorrect user or pass' });
      }
      if (err == req.body.email + " does'nt exist") {
        res.json({ status: 'User does not exist' });
      };
    });
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect('/');
  });
}

router.use(function (req, res, next) {
  // log each request to the console
  console.log('req data', req.method, req.url, req.body);
  next();
});

router.get('/', function (req, res) {
  sess = req.session;
  res.render('login');
});

router.get('/Login', function (req, res) {
  sess = req.session;
  res.render('login');
});

router.get('/SignUp', function (req, res) {
  res.render('signup');
});

router.get('/home', function (req, res) {
  if (req.session && req.session.user) { // Check if session exists
    User.findOne({ email: req.session.user.email }, function (err, user) {
      if (!user) {
        req.session.destroy();
        res.redirect('/login');
      } else {
        res.locals.user = user;
        res.render('home');
      }
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/users', function (req, res) {
  if (req.session && req.session.user) { // Check if session exists
    User.findOne({ email: req.session.user.email }, function (err, user) {
      if (!user) {
        req.session.destroy();
        res.redirect('/login');
      } else if( user.isAdmin = true ) {
        // expose the user to the template
        User.find({isAdmin: {$exists: false}}, (err, users) => {
          res.locals.allUsersData = users;
          res.locals.user = user;
          res.render('users');
        })
      }
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/profile', function (req, res) {
  if (req.session && req.session.user) { // Check if session exists
    User.findOne({ email: req.session.user.email }, function (err, user) {
      if (!user) {
        req.session.destroy();
        res.redirect('/login');
      } else {
        res.locals.user = user;
        res.render('profile');
      }
    });
  } else {
    res.redirect('/login');
  }
});

app.use('/', router);
