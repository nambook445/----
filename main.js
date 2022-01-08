const express = require('express');
const app = express();
const port = 8080;
var db = require('./model/db');
// const indexRouter = require('./routes/index');
// const pagesRouter = require('./routes/pages');
// const loginRouter = require('./routes/login');
var template = require('./template/index.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var session = require("express-session");
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore({}, db);
var flash = require('connect-flash');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';



app.use(flash());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(session({
	key: 'connect.sid',
	secret: 'fadasdfh#$^&jk252353',
	store: sessionStore,
	resave: false,
	saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.username);
});
passport.deserializeUser(function(id, done) {
  db.query(`SELECT * FROM users WHERE username=?`,[id], function (err, results) {
    if(err){
      done(null, false)
    } else {
      done(null, id);
    }
    })
});

// bcrypt.genSalt(saltRounds, function(err, salt) {
//   bcrypt.hash(post.password, 10, function(err, hash) {
//       // Store hash in your password DB.
//       bcrypt.compareSync(myPlaintextPassword, hash); // true
// bcrypt.compareSync(someOtherPlaintextPassword, hash); // false
//   });
// });
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.query(`SELECT * FROM users WHERE username =?`, [username], function (err, results) {
      var user = results[0];
     if(!user){
       return done(null, false, { message: '아이디를 찾을 수 없습니다.' })
     } else if(!bcrypt.compareSync(password, user.password)) {       
          return done(null, false,{ message: '비밀번호가 틀렸습니다.' })        
     } else {
      return done(null, user)
     } 
    });
  }
));




app.get('/', (req, res) => {
    var title = '마감일기';
    var login = template.LOGIN(req, res)
    var html = template.HTML(title, '', '', '',login);
    res.send(html);
})

app.get('/create', function (req, res) {
  if(!template.ISOWNER(req, res)){
    res.redirect('/login')
  } else {
    var title = '글쓰기';
    var login = template.LOGIN(req, res)
    var html = template.HTML(title, '',`
        <form class="form" method="post" action="/create_process">
            <input class="title" type="text" name="title" placeholder="title">
            <textarea id="summernote" name="description"></textarea>
            <script>
                $(document).ready(function() {
                    $('#summernote').summernote({
                    lang: 'ko-KR' // default: 'en-US'
                    });
                });
            </script>                     
            <p><input type="submit" value="마감"></p>  
        </form>
    `,'',login); 
    res.send(html);}
})

app.get('/page/:pageId', function (req, res) {
db.query(`SELECT * FROM topic WHERE id=?`,[req.params.pageId],function (err, results) {
    if(err){
        throw err;
    }
    var title = results[0].title;
    var login = template.LOGIN(req, res)
    var description = results[0].description;
    var html = template.HTML(title, '', `
    <form class="form" method="post" action="/create_process">
        <input class="title" type="text" name="title" placeholder="title" value="${title}">
        <textarea id="summernote" name="description">${description}</textarea>
        <script>
            $(document).ready(function() {
                $('#summernote').summernote({
                lang: 'ko-KR' // default: 'en-US'
                });
            });
        </script>                     
        <p><input type="submit" value="마감"></p>  
    </form>
    <a href="/update/${req.params.pageId}">update</a>
    `,
      ` 
    <p>
    <form method="post" action="/delete_process">
    <input type="hidden" name="id" value="${req.params.pageId}">
    <input type="submit" value="delete">
    </form>`
    ,login); 
        res.send(html);        
});
});

app.get('/update/:updateId', function (req, res) {
  if(!template.ISOWNER(req, res)){
    res.redirect('/login')
  } else {
    db.query(`SELECT * FROM topic WHERE id=?`,[req.params.updateId],function (err, results) {
      if(err){
          throw err;
      }
      var title = results[0].title;
      var login = template.LOGIN(req, res)
      var description = results[0].description;
      var html = template.HTML(title, '', `
        <form class="form" method="post" action="/update_process">
            <input type="hidden" name="id" value="${results[0].id}"> 
            <input class="title" type="text" name="title" placeholder="title" value="${title}">
            <textarea id="summernote" name="description">${description}</textarea>
            <script>
                $(document).ready(function() {
                    $('#summernote').summernote({
                    lang: 'ko-KR' // default: 'en-US'
                    });
                });
            </script>                     
            <p><input type="submit" value="마감"></p>  
        </form>
        `,`
        <p>
        <form method="post" action="/delete_process">
            <input type="hidden" name="id" value="${results[0].id}">
            <input type="submit" value="delete">
        </form>
        </p>`,login); 
      res.send(html);
    });
  }
});

    
  


app.get('/board', (req, res,) => {
db.query(`SELECT * FROM topic`, function (err, results) {
    var title = '글목록';
    var login = template.LOGIN(req, res)
    var table = template.TABLE(results);
    var html = template.HTML(title, '', table,'',login); 
    res.send(html);
    })
})

app.post('/create_process', function (req, res) {
  var post = req.body;
  db.query(`INSERT INTO topic (title, description, created, author_id) 
          VALUES(?, ?, NOW(), ?)`,
          [post.title, post.description, 1], 
          function(err, results){  
          res.redirect(`/board`);
  });
})

app.post('/update_process', function (req, res,) {
  var post = req.body;
  db.query('UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?', [post.title, post.description, post.id],function(err, results){
      if(err){
          throw err;
      }     
      res.redirect(`/board`);
  });
});

app.post('/delete_process', function (req, res) {
  if(!template.ISOWNER(req, res)){
    res.redirect('/login')
  } else {
    var post = req.body;
    db.query(`DELETE FROM topic WHERE id = ?`, [post.id], function (err, results) {
        if(err){
            throw err;
        }
        res.redirect('/board')
    })
  }
})
app.get('/login',(req, res) =>{
  var fmsg = req.flash();
  var feedback = '';
  if(fmsg.error){
    feedback = fmsg.error[0];
  }
  var title = '로그인';
  var login = template.LOGIN(req, res)
  var html = template.HTML(title, feedback,`
    <a href="/login/resister">회원가입</a>
    
    <form action="/login" method="post">
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
    </form>`,'',login);     
  res.send(html)
});

app.post('/login',
    passport.authenticate('local', { successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);

app.get('/logout', function (req, res) {
  req.logOut();
  req.session.save(function () {
    res.redirect('/');
  })
})

app.get('/login/resister', function(req, res){
    var title = '회원가입';
    var login = template.LOGIN(req, res);
    var html = template.HTML(title,`
    <form action="/login/resister" method="post">
        <div>
            <label for="username">Username</label>
            <input name="username" type="text" autocomplete="username" required />
        </div>
        <div>
            <label for="current-password">Password</label>
            <input name="password" type="password" autocomplete="current-password" required />
        </div>
        <div>
            <label for="nickname">nickname</label>
            <input name="nickname" type="text" autocomplete="nickname" required />
        </div>
        <div>
            <button type="submit">Sign in</button>
        </div>
    </form>`,'','',login);
    res.send(html);
});


app.post('/login/resister', (req, res) =>{
    var post = req.body;
    bcrypt.genSalt(saltRounds, function(err, salt) {
      bcrypt.hash(post.password, salt, function(err, hash) {
        db.query(`INSERT INTO users (username,password,nickname,created) VALUES (?,?,?, NOW()) `,[post.username,hash,post.nickname], function (err, results) {
          var user = post;
          if(err){   
            res.sendStatus(500);
          } else{
            req.login(user, function (err) {
              req.session.save(function () {
                res.redirect('/');
                })
              })
          }
        })
      });     
    });
});

  




// app.get('/login', loginRouter);
// app.post('/login', loginRouter);
// app.get('/login/resister', loginRouter);
// app.post('/login/resister', loginRouter);
// app.get('/logout', loginRouter)
// app.get('*', indexRouter);
// app.post('*', pagesRouter);


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