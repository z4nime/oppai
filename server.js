'use strict';

// simple express server
var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy'); //middleware for form/file upload
var formidable = require('formidable');
var path = require('path');     //used for file path
var fs = require('fs-extra');       //File System - for file manipulation

//var users = require('./api/users');
var db_config = {
  	host: 'localhost',
    user: 'root',
    password: '',
    database: 'anime'
};
var db;

// time 
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 

today = dd+'-'+mm+'-'+yyyy;

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

app.use('/', express.static('public'));
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));
//parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// user
app.get('/api/users/', function(req, res,next) {
	db.query('select * from user', function(err, rows, fields) {
	  	if (err) throw err;
		  //res.send("data");
		  res.json(rows);

	});
});
app.get('/api/users/:oppai_name', function(req, res) {
	db.query("select * from user where oppai_name='"+req.params.oppai_name+"'", function(err, rows, fields) {
	  	if (!req.params) 
	 		return res.sendStatus(400);
	 	else res.json(rows);

	});
});
app.post('/api/login', function(req, res) {
	db.query("select * from user where email='"+req.body.email+"'", function(err, rows, fields) {
	  	if (!rows) 
	 		return res.send("not result");
	 	else res.json(rows);

	});
});
app.post('/api/users/register/',function(req, res) {
	db.query("insert user set oppai_name='"+req.body.oppai_name+"', email='"+req.body.email+"', password='"+req.body.password+"' , avatar='http://data.whicdn.com/images/175676560/superthumb.jpg' , permission=1", function(err, rows, fields) {
	 	if (!req.body) 
	 		return res.sendStatus(400);
	 	else res.json(req.body);
	});
});

// anime 
app.post('/api/upload/cover_anime',function(req,res){
	var form = new formidable.IncomingForm();
    //Formidable uploads to operating systems tmp dir by default
    form.uploadDir = "./public/data/cover_anime/";       //set upload directory
    form.keepExtensions = true;     //keep file extension

    form.parse(req, function(err, fields, files) {
        // console.log("file size: "+JSON.stringify(files.fileUploaded.size));
        // console.log("file path: "+JSON.stringify(files.fileUploaded.path));
        // console.log("file name: "+JSON.stringify(files.fileUploaded.name));
        // console.log("file type: "+JSON.stringify(files.fileUploaded.type));
        // console.log("astModifiedDate: "+JSON.stringify(files.fileUploaded.lastModifiedDate));

        // //Formidable changes the name of the uploaded file
        // //Rename the file to its original name
        // fs.rename(files.fileUploaded.path, './public/data/cover_anime/'+files.fileUploaded.name, function(err) {
        // if (err)
        //     throw err;
        //   console.log('renamed complete');  
        // });
        //res.redirect('back');
        var modifieName = files.image.path.split("\\");
        files.image.path = "/"+modifieName[1]+"/"+modifieName[2]+"/"+modifieName[3];
        db.query("insert image_oppai set name='"+files.image.name+"', path='"+files.image.path+"', create_image='"+today+"'", function(err, rows, fields) {
        	res.json(files.image)
		});
        
    });
});

app.get('/api/anime', function(req, res) {
	db.query('select * from anime', function(err, rows, fields) {
	  	if (err) throw err;
		 res.json(rows);
	});
});
app.get('/api/anime/:id', function(req, res) {
	db.query("select * from anime where anime_id='"+req.params.id+"'", function(err, rows, fields) {
	  	if (err) throw err;
		 res.json(rows);
	});
});
app.post('/api/anime/create',function(req,res){
  db.query("insert anime set topic='"+req.body.topic+"', cover_path='"+req.body.cover+"', status='"+req.body.status.name+"' ,detail='"+req.body.detail+"' ,update_time='"+today+"'", function(err, rows, fields) {
    if (!req.body) 
      return res.sendStatus(400);
    else res.json(req.body.data);
  });
});
app.put('/api/anime/', function(req, res) {
	db.query("update anime set topic='"+req.body.topic+"' , status='"+req.body.status+"' , detail='"+req.body.detail+"' , update_time='"+today+"' where anime_id='"+req.body.anime_id+"'", function(err, rows, fields) {
	  	if (err) throw err;
		res.json(rows);
	});
});
app.delete('/api/anime/:anime_id',function(req,res){
  db.query("delete from anime where anime_id='"+req.params.anime_id+"'",function(err,rows,fileds){
    if (err) throw err;
     res.json(rows);
  })
});


// episode
app.post('/api/anime/episode/',function(req,res){
	db.query("insert episode set anime_id='"+req.body[0].anime_id+"', ep='"+req.body[0].ep+"', url='"+req.body[0].url+"', type='"+req.body[0].type+"'",function(err,rows,fields){
		if(!req.body)
			return res.sendStats(400);
		else res.json(req.body[0].data);
	});
});
app.get('/api/anime/episode/:id',function(req,res){
	db.query("select * from episode where anime_id='"+req.params.id+"'",function(err,rows,fileds){
		if (err) throw err;
		 res.json(rows);
	})
});
app.delete('/api/anime/episode/del/:anime_id/:ep',function(req,res){
  db.query("delete from episode where anime_id='"+req.params.anime_id+"' and ep='"+req.params.ep+"' ",function(err,rows,fileds){
    if (err) throw err;
     res.json(rows);
  })
});

//temp
app.post('/api/temp',function(req,res){
  db.query("insert temp set oppai_name='"+req.body.oppai_name+"', action='"+req.body.action+"', ip='"+req.body.ip+"', date='"+today+"',date_time='"+req.body.date_time+"'",function(err,rows,fields){
    if(!req.body)
      return res.sendStats(400);
    else res.json(req.body);
  });
});
app.get('/api/temp',function(req,res){
  db.query("select * from temp",function(err,rows,fields){
    if (err) throw err;
      res.json(rows);
  });
});
app.delete('/api/temp',function(req,res){
  db.query("DELETE FROM temp WHERE 1",function(err,rows,fields){
    if (err) throw err;
      res.json(rows);
  });
});
app.listen(8888); 
//console.log("Server on port : 3000")