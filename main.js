const express = require('express')
const app = express()
const port = 8080
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
const router = require('./routes/index');
// var topicRouter = require('./routes/topic');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('*', (req, res, next) => {

   next()
})


app.use('/', indexRouter);
// app.use('/topic', topicRouter);

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