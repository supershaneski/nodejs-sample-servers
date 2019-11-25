var express = require('express');
var app = express();
var fs = require('fs');
var path = require('path');
var utils = require('./utils.js');

const SERVER_IP_ADDRESS = utils.getIPAddress();
const SERVER_IP_PORT = 9090;

// request logger
var logger = function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.replace(/^.*:/, '');
    console.log((new Date()).toLocaleTimeString() +  " " + ip + " " + req.path);
    next();
}
app.use(logger);

// media folder in separate directory
app.use('/media', express.static(path.join(__dirname,'../media/')));

// static files root directory
app.use(express.static(path.join(__dirname,'../public/')));

// random image
app.get('/image', function (req, res) {
    sendImage(res);
});
app.get('/image/:id', function (req, res) {
    sendImage(res, req.params.id);
});
function sendImage(res, id) {
    const chance = utils.getRandomInt(0,10);
    id = isNaN(id)?chance:parseInt(id);
    id = id % 4;
    const file = path.join(__dirname,'../media/pic' + id + '.jpg');
    fs.exists(file, function (exists) {
        if (!exists) {
           // 404 missing files
           res.writeHead(404, {'Content-Type': 'text/plain' });
           res.end('404 Not Found');
           return;
        }
        var img = fs.readFileSync(file);
        res.writeHead(200, {'Content-Type': 'image/jpeg' });
        res.end(img, 'binary');
    });
}

var server = app.listen(SERVER_IP_PORT, function () {
    var port = server.address().port;
    console.log((new Date()).toLocaleTimeString() + " Server started at http://%s:%s", SERVER_IP_ADDRESS, port);
});
