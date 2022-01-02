const express = require('express')
const app = express()
const port = 8080
const indexRouter = require('./routes/index');
const pagesRouter = require('./routes/pages');
const bodyParser = require('body-parser');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('*', indexRouter);
app.post('*', pagesRouter);

app.post('/login_process',
  passport.authenticate('local', { successRedirect: '/',
  failureRedirect: '/login' }));
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));


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