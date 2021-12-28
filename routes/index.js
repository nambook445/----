var express = require('express');
var router = express.Router();
var template = require('../template/index.js');
 
router.get('/', function(req, res) { 
    var title = '마감일기';
    var description = 'Hello, Node.js';
    var list = ''
    var html = template.index(title, list,
      '',
    ); 
    res.send(html);
  });
   
  module.exports = router;