const express = require('express')
const app = express()
const port = 8080
var indexRouter = require('./routes/index');
var pagesRouter = require('./routes/pages');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

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