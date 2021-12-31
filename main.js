const express = require('express')
const app = express()
const port = 8080
var mysql      = require('mysql');
var db = require('./model/db');;
var template = require('./template/index.js');
// var indexRouter = require('./routes/index');
// // var pagesRouter = require('./routes/pages');
var bodyParser = require('body-parser');
var methodOverride = require('method-override')
const { pageResults } = require('./template/index.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
}))

app.get('/', (req, res,) => {
    db.query(`SELECT * FROM topic`, function (err, results) {
        var title = '마감일기';
        var html = template.HTML(title, '', '', ''); 
        res.send(html);
      })
})

app.get('/create', function (req, res) {
    var title = '글쓰기';
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
    `,''); 
    res.send(html);
})

app.post('/create_process', function (req, res,) {
    var post = req.body;
    db.query(`INSERT INTO topic (title, description, created, author_id) 
            VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, 1], 
            function(err, results){     
            res.redirect(`/board`);
    });
})

app.get('/page/:pageId', function (req, res) {
        db.query(`SELECT * FROM topic WHERE id=?`,[req.params.pageId],function (err, results) {
            if(err){
                throw err;
            }
            var title = results[0].title;
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
        `,` <a href="/update/${req.params.pageId}">update</a>
        <p>
        <form method="POST" action="/delete_process" enctype="application/x-www-form-urlencoded">
        <input type="hidden" name="_method" value="DELETE">
        <input type="hidden" name="id" value="${req.params.pageId}">
        <input type="submit" value="delete">
        </form>
        </p>
        <form method="POST" action="/resource" enctype="application/x-www-form-urlencoded">
  <input type="hidden" name="_method" value="DELETE">
  <button type="submit">Delete resource</button>
</form>
        
        `); 
            res.send(html);
        
    });
});

app.get('/update/:updateId', function (req, res) {
    db.query(`SELECT * FROM topic WHERE id=?`,[req.params.updateId],function (err, results) {
        if(err){
            throw err;
        }
        var title = results[0].title;
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
        <input type="hidden" name="delete" value="delete">
                <input type="hidden" name="id" value="${results[0].id}">
                <input type="submit" value="delete">
        </form>
        </p>`); 
        res.send(html);
    
    });
});

app.put('/update_process', function (req, res,) {
    var post = req.body;
    db.query('UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?', [post.title, post.description, post.id],function(err, results){
        if(err){
            throw err;
        }     
        res.redirect(`/board`);
    });
});
app.delete('/delete_process', function (req, res) {
    var post = req.body;
    db.query(`DELETE FROM topic WHERE id = ?`, [post.id], function (err, results) {
        if(err){
            throw err;
        }
        res.redirect('/board')
    })
})
app.get('/board', (req, res,) => {
db.query(`SELECT * FROM topic`, function (err, results) {
    var title = '글목록';
    var table = template.TABLE(results);
    var html = template.HTML(title, '', table,''); 
    res.send(html);
    })
})



// app.use('/', indexRouter);
// app.use('/create_process', pagesRouter);

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