var express = require('express');
var morgan = require('morgan');
var path = require('path');
const Pool= require('pg').Pool;
var crypto = require('crypto');

const pool = new Pool({
  user: 'vipulrawat007',
  host: 'db.imad.hasura-app.io',
  database: 'vipulrawat007',
  password: process.env.DB_PASSWORD,
  port: 5432,
});


var app = express();
app.use(morgan('combined'));
app.use('/ui',express.static('ui'));

app.get('/dbtest',function(req,res){
   pool.query('SELECT * FROM TEST', function(err, result){
         if(err){
             res.status(500).send(err.toString());
         }else{
             res.send(JSON.stringify(result.rows));
         }
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/article-one',function(req,res){
  res.sendFile(path.join(__dirname, 'ui', 'article-one.html'));
});
app.get('/article-two',function(req,res){
  res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});
//user login system
function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input,salt,10,512,'sha512');
    return hashed;
}
app.get('/user/:input',function(req,res){
    var slt = crypto.randomBytes(128).toString('hex');
    var hashedValue = hash(req.params.input,slt);
    res.send(hashedValue.toString('hex'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
