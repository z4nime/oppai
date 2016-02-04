//var express = require('express');
//var app = express();
//var app = module.exports.app = exports.app = express();
//app.use(require('connect-livereload')());
//app.use(express.static('public'));
//var data = [];
// app.get('/member', function (req, res) {
//   res.send();
  
// });
// // accept PUT request at /user
// // app.get('/', function (req, res) {
// //   res.send('Hello !');
// // });
// // accept PUT request at /user
// app.get('/api/insert/:name/:grade', function(req, res) {
// data.push({"name" : req.route.params.name , "grade" : req.route.params.grade});
//   //res.send(req.route.params.id);
//   res.send(data);
//   console.log(req)
// });

// app.get('/api/edit/:id/:name/:grade', function(req, res) {
// 	data[req.route.params.id].name = req.route.params.name;
// 	data[req.route.params.id].grade = req.route.params.grade;

//   //res.send(req.route.params.id);
//   res.send(data);
// });

// app.get('/api/del/:id', function(req, res) {
// data.splice(req.route.params.id, 1);
//   //res.send(req.route.params.id);
//   res.send(data);
// });
'use strict';

// simple express server
var express = require('express');
var app = express();
var router = express.Router();


app.use('/', express.static('public'));

app.get('/api', function(req, res) {
  res.send("data");
});

app.listen(3000);
console.log("server on port : 3000")