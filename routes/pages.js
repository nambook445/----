var express = require('express');
var router = express.Router();
var template = require('../template/index.js');
var db = require('../model/db');

router.post('/create_process', function (req, res) {
    var post = req.body
    db.query(`
            INSERT INTO topic (title, description, created, author_id) 
              VALUES(?, ?, NOW(), ?) WHERE id=?`,[post[0].id] ,
            [post.title[0], post.description[0], post.author_id[0]], 
            function(err, result){
              if(err){
                throw err;
              }console.log(post);
              res.redirect(302, {Location: `/`});
            }
          )
      });
      module.exports = router;
    // var body = '';
//       request.on('data', function(data){
//           body = body + data;
//       });
//       request.on('end', function(){
//           var post = qs.parse(body);
//           db.query(`
//             INSERT INTO topic (title, description, created, author_id) 
//               VALUES(?, ?, NOW(), ?)`,
//             [post.title, post.description, post.author], 
//             function(error, result){
//               if(error){
//                 throw error;
//               }
//               response.writeHead(302, {Location: `/?id=${result.insertId}`});
//               response.end();
//             }
//           )
//       });
// }