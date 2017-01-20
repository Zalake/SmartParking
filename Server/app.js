console.log('App setup');
var express = require('express');
var mysql = require('mysql');
var http = require('http');
var bodyParser = require('body-parser')
var exphbs  = require('express-handlebars');

var app = express();

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '',
  database : 'rfid'
});

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var oldrfid="000000000000";
var oldtime=new Date();
connection.connect(function(err) {
	if(!err)
		console.log("connected");
	else
		console.log("not connected");
	// body...
});
function update(rfid,id)
{
	console.log("updating!");
	connection.query('update info set checkout=NOW() where rfid="'+rfid+'" and checkin=checkout', function(err, rows, fields) {
	if (!err)
	console.log('The solution is: ', rows);
	else
	console.log('Error while performing Query.2');
	});
}
function insert(rfid,id)
{
	console.log("inserting!",id);
	var query = 'insert into info (rfid,pid) values("'+rfid+'",'+id+')';
	console.log(query);
    connection.query(query, function(err, rows, fields) {
 	if (!err)
    console.log('The solution is: ', rows);
  	else
    console.log('Error while performing Query.3');
	});
}

app.get('/api', function(req,res){
	console.log(req.query.pid);
	var curtime=new Date();
	//console.log(""+(curtime-oldtime));
	console.log(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
	if(req.query.name)
	{
		//var difftime;
		if(!(req.query.name==oldrfid && (curtime-oldtime)<3000))
		{
		connection.query('select * from info where rfid="'+req.query.name+'" and checkin=checkout',function(err,rows,fields){
			if (!err)
		    {
		    	console.log('The solution is: ', rows);
		    			if(rows.length==1)
							update(req.query.name,req.query.pid);
							//difftime=curtime-oldtime;
						else
							insert(req.query.name,req.query.pid);
		    	
		    }
		  	else
		    console.log('Error while performing Query.1');
		});
		}
		oldtime=curtime;
		oldrfid=req.query.name;
	    res.send("Data Received");
	    //res.send(difftime.toString());
	}
	else
		res.send("Not Received");
});

app.get('/stat', function(req,res){
	var query = 'select parkingid,t_count,occupied_count,t_count-occupied_count as av,((t_count-occupied_count)/t_count)*100 asfrom stat';
	connection.query(query, function(err, rows, fields) {
		if (!err){
			console.log(rows);
			res.render('home',{'rows': rows});
		}
	  	else
	    console.log('Error while performing Query.4');
	});
});
http.createServer(app).listen(3001);



