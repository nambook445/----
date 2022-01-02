var express = require('express');
var router = express.Router();
var template = require('../template/index.js');
var db = require('../model/db');

router.get('/', (req, res,) => {
  db.query(`SELECT * FROM topic`, function (err, results) {
      var title = '마감일기';
      var html = template.HTML(title, '', '', ''); 
      res.send(html);
    })
})

router.get('/create', function (req, res) {
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

router.get('/page/:pageId', function (req, res) {
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
      <a href="/update/${req.params.pageId}">update</a>
      `,
        ` 
      <p>
      <form method="post" action="/delete_process">
      <input type="hidden" name="id" value="${req.params.pageId}">
      <input type="submit" value="delete">
      </form>`
      ); 
          res.send(html);        
  });
});

router.get('/update/:updateId', function (req, res) {
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
          <input type="hidden" name="id" value="${results[0].id}">
          <input type="submit" value="delete">
      </form>
      </p>`); 
      res.send(html);

  });
});

router.get('/board', (req, res,) => {
  db.query(`SELECT * FROM topic`, function (err, results) {
      var title = '글목록';
      var table = template.TABLE(results);
      var html = template.HTML(title, '', table,''); 
      res.send(html);
      })
  })
  module.exports = router;