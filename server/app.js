var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')


var app = express()
module.exports = app

var data = require('./routes/data')

var publicPath = path.join(__dirname, '../public')
var nodePath = path.join(__dirname,'../node_modules')
var bowerPath = path.join(__dirname,'../bower_components')

var indexHtmlPath = path.join(__dirname, '../index.html')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(publicPath))
app.use(express.static(nodePath))
app.use(express.static(bowerPath))

app.use('/data',data)

app.get('/', function (req, res) {
    res.sendFile(indexHtmlPath);
});
