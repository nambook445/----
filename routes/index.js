var express = require('express');
const app = express()
var router = express.Router();
var template = require('../template/index.js');
var db = require('../model/db');

router.get('/', function(req, res) { 
    db.query(`SELECT * FROM topic`, function (err, topics) {
        var title = '마감일기';
        var list = topics;
        var index = template.index(title, list,
          '',
        ); 
        console.log(list);
        res.send(index);
      })
  });
  router.get('/create', function (req, res) {
    var page = template.page()
    res.send(page);
  })
  router.post('/create_process', function (req, res) {
      var post = req.body
    db.query(`
            INSERT INTO topic (title, description, created, author_id) 
              VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, 1], 
            function(err, result){
              if(err){
                throw err;
              }console.log(post);
              res.redirect(302, {Location: `/`});
            }
          )
      });

   
  module.exports = router;