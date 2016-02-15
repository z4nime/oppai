//'use strict';

// simple express server
var express = require('express');
var app = express();
var mysql = require('mysql');
var cors = require('cors');
var bodyParser = require('body-parser');

var db_config = {
  	host: 'localhost',
    user: 'root',
    password: '',
    database: 'anime'
};
var corsOptions = {
  origin: 'http://example.com'
};
app.use(cors(corsOptions));
app.use('/', express.static('public'));
//parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/api/users/', function(req, res,next) {
	db.query('select * from user', function(err, rows, fields) {
	  	if (err) throw err;
		  //res.send("data");
		  res.json(rows);

	});
});
app.get('/api/users/:name', function(req, res,next) {
	db.query("select * from user where name='"+req.params.name+"'", function(err, rows, fields) {
	  	if (!req.params) 
	 		return res.sendStatus(400);
	 	else res.json(rows);

	});
});

app.post('/api/users/register/:oppai_name/:email/:password',function(req, res) {
	db.query("insert user set name='"+req.params.oppai_name+"', email='"+req.params.email+"', password='"+req.params.password+"' , avatar='http://data.whicdn.com/images/175676560/superthumb.jpg' , permission=1", function(err, rows, fields) {
	 	var data = {"name" : req.params.oppai_name , "email" : req.params.email , "password" : req.params.password};
	 	if (!req.params) 
	 		return res.sendStatus(400);
	 	else res.json(data);
	});
	
});


var db;
function handleDisconnect() {
  	db = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.
  	db.connect(function(err) {              // The server is either down
	    if(err) {                                     // or restarting (takes a while sometimes).
	      	console.log('error when connecting to db');
	      	setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
	    }                                     // to avoid a hot loop, and to allow our node script to
  	});                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  	db.on('error', function(err) {
	    console.log('Connection Lost');
	    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
	      	handleDisconnect();                         // lost due to either server restart, or a
	    } else {                                      // connnection idle timeout (the wait_timeout
	      	throw err;                                  // server variable configures this)
	    }
  	});
}

handleDisconnect();

app.listen(3000); 
console.log("Server on port : 3000")