var express = require('express');
var router = express.Router();
var template = require('../template/index.js');
 
router.get('/', function(req, res) { 
    var title = '마감일기';
    var list = ''
    var index = template.index(title, list,
      '',
    ); 
    res.send(index);
  });
  router.get('/create', function (req, res) {
    var page = template.page()
    res.send(page);
  })
  router.get('/create_process', function (req, res) {
    var page = template.page()
    res.send(page);
  })
   
  module.exports = router;