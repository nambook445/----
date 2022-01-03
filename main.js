const express = require('express')
const app = express()
const port = 8080
const indexRouter = require('./routes/index');
const pagesRouter = require('./routes/pages');
var db = require('./model/db');
var template = require('./template/index.js');
var session = require("express-session");
var bodyParser = require('body-parser');
var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;
const req = require('express/lib/request');


app.use(express.static('public'));
app.use(session({ 
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



  app.get('/login',(req, res) =>{
    db.query(`SELECT * FROM author`, function (err, results) {
        var title = '로그인';
        var html = template.HTML(title, `
        <form action="/login_process" method="post">
          <div>
              <label for="username">Username</label>
              <input id="username" name="username" type="text" autocomplete="username" required />
          </div>
          <div>
              <label for="current-password">Password</label>
              <input id="current-password" name="password" type="password" autocomplete="current-password" required />
          </div>
          <div>
              <button type="submit">Sign in</button>
          </div>
        </form>`,'',''); 
    
res.send(html)
})
});



  passport.use(new LocalStrategy(
    function(username, password, done) {
      db.query(`SELECT * FROM users WHERE username =? AND password =?`, [username, password], function (err, user) {
        console.log(username);
        
        if(username === user[0].username && password === user[0].password){
          return done(null, express.user);
        } else if(!username === user[0].username && password === user[0].password) {
          return done(null, false, { message: 'Incorrect username.' });
        } else if(username === user[0].username && !password === user[0].password)
          return done(null, false, { message: 'Incorrect password.' });
        else{
          if (err) { return done(err); }
        }
        
        // if (err) { return done(err); }
        // if (!user) {
        //   return done(null, false, { message: 'Incorrect username.' });
        // }
        // if (!user.validPassword(password)) {
        //   console.log(3);
        //   return done(null, false, { message: 'Incorrect password.' });
        // }
        // console.log(4);
        // return done(null, user);
      });
    }
  ));
  


  app.post('/login_process',
  passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login' }));
  

  
  app.get('*', indexRouter);
  app.post('*', pagesRouter);
  
  
  app.use(function(req, res, next) {
    res.status(404).send('Sorry cant find that!');
  });
  
  
  
  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  });
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })