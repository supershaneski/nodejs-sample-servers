var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

var path = require('path');
var utils = require('./utils.js');

const SERVER_IP_ADDRESS = utils.getIPAddress();
const SERVER_IP_PORT = 9000;

// data
const jsonfile = path.join(__dirname,'../data/data.json'); //__dirname + "/test.json";

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// cors
app.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "http://192.168.1.145"); // update to match the domain you will make the request from
    //res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
   
    next();
});

// get user list
app.get('/user', function (req, res) {
    res.sendFile(jsonfile);
});

// get user
app.get('/user/:id', function (req, res) {
    const userid = req.params.id;
    fs.readFile(jsonfile, 'utf8', function (err, data) {
        data = JSON.parse(data);
        if(data.hasOwnProperty(userid)) {
            res.end(JSON.stringify(data[userid]));
        } else {
            res.status(404).send({message: "Not found"});
        }
    })
});

// add user
app.post('/user/add', function (req, res) {
    var sparam = req.body;
    var sname = sparam.name;
    
    fs.readFile(jsonfile, 'utf8', function (err, data) {
        data = JSON.parse(data);

        var lastId;
        for(var id in data) {
            lastId = parseInt(id);
        }
        if(!lastId) lastId = 1000;
        
        var newId = lastId + 1;
        var newUser = {};
        newUser[newId] = {
            name: sname,
            admin: false,
            type: utils.getRandomInt(0,3)
        }
        data[newId] = newUser[newId];
        
        fs.writeFile(jsonfile, JSON.stringify(data), (err) => {
            if (err) throw err;
            res.send(JSON.stringify(newUser));
        })
    })

});

// delete user
app.delete('/user/:id', function (req, res) {
  
  var userid = req.params.id;
  fs.readFile(jsonfile, 'utf8', function (err, data) {
    
    data = JSON.parse(data);
    if(data.hasOwnProperty(userid)) {
      
      delete data[userid];
      var datastr = JSON.stringify(data);
      fs.writeFile(jsonfile, datastr, (err) => {
        if (err) throw err;
        res.send(datastr);
      })

    } else {
      res.status(404).send({message: "user not found"});
    }

  })

});

// add/update user
app.put('/user/:id', function (req, res) {
  
  var skey = req.params.id;
  var sdata = JSON.parse(req.body.data);
  
  var user = {};
  user[skey] = sdata;
  
  fs.readFile(jsonfile, 'utf8', function (err, data) {
    data = JSON.parse(data);
    data[skey] = user[skey];
    
    console.log((new Date()).toLocaleTimeString());

    var datastr = JSON.stringify(data);
    fs.writeFile(jsonfile, datastr, (err) => {
      if (err) throw err;
      res.send(JSON.stringify(sdata));
    })

  })

});

var server = app.listen(SERVER_IP_PORT, function () {
   var port = server.address().port;
   console.log((new Date()).toLocaleTimeString() + " Server started at http://%s:%s", SERVER_IP_ADDRESS, port);
});