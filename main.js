const express = require('express');
const app = express();
const port = 8080;
var db = require('./model/db');
const indexRouter = require('./routes/index');
const pagesRouter = require('./routes/pages');
const loginRouter = require('./routes/login');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require("express-session");
var passport = require('passport')
var LocalStrategy = require('passport-local').      Strategy;
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(session({
	key: 'session_cookie_name',
	secret: 'session_cookie_secret',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

app.use(express.static('public'));
  
app.get('/login', loginRouter);
app.post('/login', loginRouter);
app.get('/login/resister', loginRouter);
app.post('/login/resister', loginRouter);
app.get('/logout', loginRouter)
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