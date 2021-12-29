const express = require('express')
const app = express()
const port = 8080
var db = require('./model/db');
var template = require('./template/index.js');
// var indexRouter = require('./routes/index');
// // var pageRouter = require('./routes/page');
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res,) => {
    db.query(`SELECT * FROM topic`, function (err, topics) {
        var title = '마감일기';
        var list = topics;
        var index = template.index(title, list,
          '',
        ); 
        res.send(index);
      })
})
app.get('/create', function (req, res) {
    var page = template.page()
    res.send(page);
});

app.post('/create_process', function (req, res,) {
    var post = req.body;
  db.query(`
          INSERT INTO topic (title, description, created, author_id) 
            VALUES(?, ?, NOW(), ?)`,
          [post.title, post.description, 1], 
          function(err, result){
            if(err){
              throw err;
            }console.log(result.insertId);
            res.redirect(`/page/${result.insertId}`);
          }
        )
});
app.get('/page/:pageId', function (req, res) {
    db.query(`SELECT * FROM topic WHERE id="?"`, function (err, topics) {
        if(err){
            throw err;
        }
        var page = template.page(topics);
        res.send(page);
      })
});


// app.use('/', indexRouter);
// app.use('/create_process', pageRouter);

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