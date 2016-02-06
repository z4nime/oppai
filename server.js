'use strict';

// simple express server
var express = require('express');
var app = express();
var Router = express.Router();
var mysql = require('mysql');
var cors = require('cors');

var corsOptions = {
  origin: 'http://www.example.com'
};

var db_config = {
  	host: 'localhost',
    user: 'root',
    password: '',
    database: 'anime'
};

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

//app.use(cors());
app.use('/', express.static('public'));

app.get('/api/member/',function(req, res) {
	db.query('select * from user', function(err, rows, fields) {
	  	if (err) throw err;
		  //res.send("data");
		  res.json(rows);
	});
	
});
app.post('/api/member/register/:oppai_name/:email/:password', function(req, res) {
	db.query("insert user set name='"+req.params.oppai_name+"', email='"+req.params.email+"', password='"+req.params.password+"'", function(err, rows, fields) {
	  	if (err) throw err;
		  	//console.log('The solution is: ', rows);
		  	//res.send(rows);
	});
	
});


app.listen(8000); 
//console.log("Server on port : 8000")