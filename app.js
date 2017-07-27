var express=require("express"),
    bodyParser=require("body-parser"),
    mysql=require("mysql")

var db=mysql.createConnection({
	user: 'root',
	host: 'localhost',
	password: 'teddybravoç&',
	database: 'patients'
});

db.connect(function(err){
	if (err)
		throw err;
	console.log("db connected");
});   
	
app=express();

var port=process.env.PORT || 2020;
app.set('view engine', 'ejs');

app.use(express.static('public'));
//app.use(express.static(path.join(process.cwd(), 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
	res.render("loginproto");
});

app.get("/home", function(req, res){
	res.render("homepage");
});

app.get("/home/h_login", function(req, res){
	res.render("hloginproto");
});

app.get("/home/cc_login", function(req, res){
	res.render("ccloginproto");
});

app.post("/insert", function(req, res){
	var date=new Date(req.body.datecons);
	console.log("date "+date+" ==>> "+date.getDate());
	date.setDate(date.getDate() + 2);
	console.log("suivieDate "+date);
	var data={
		noms:req.body.nom,
		tel:req.body.tel,
		raison:req.body.raison,
		pres:req.body.pres,
		cons:req.body.datecons,
		suivie:date.toString(),
		rdv:req.body.daterdv
	};
	var query="insert into patientsTbl set ? ";
	db.query(query, data, function (err, result) {
	    if (err) 
	    	throw err;
	    console.log("1 record inserted");
	});
	console.log("name = "+req.body.nom);
	res.redirect("/form")
});

app.get("/form", function(req, res){
	res.render("formedata");
});

app.post("/h_login", function(req, res){
	var username=req.body.user;
	var password=req.body.pass;
	console.log(req.body);
	console.log("login successfully submitted "+JSON.stringify(username)+" "+password);
	var query="select * from users where username = ?";
	db.query(query, [username], function(err, rows, fields){
		if(err){
			throw err;
			res.redirect("/");
		}
		else{
			console.log("solution = "+rows);
			for(var i in rows){
				console.log(rows[i]);
			}
			if(rows.length>0){
				if(rows[0].password==password){
					console.log("login successful");
					res.redirect("/form");
				}
				else{
					console.log("username and password don't match");
					res.redirect("/");
				}
			}
			else{
				console.log("username does not exit");
				res.redirect("/");
			}
		}
	});
})

app.post("/cc_login", function(req, res){
	var username=req.body.user;
	var password=req.body.pass;
	console.log(req.body);
	console.log("login successfully submitted "+JSON.stringify(username)+" "+password);
	var query="select * from ccusersTbl where username = ?";
	db.query(query, [username], function(err, rows, fields){
		if(err){
			throw err;
			res.redirect("/");
		}
		else{
			console.log("solution = "+rows);
			for(var i in rows){
				console.log(rows[i]);
			}
			if(rows.length>0){
				if(rows[0].password==password){
					console.log("login successful");
					res.redirect("/table");
				}
				else{
					console.log("username and password don't match");
					res.redirect("/");
				}
			}
			else{
				console.log("username does not exit");
				res.redirect("/");
			}
		}
	});
})

/*app.get("/table", function(req, res){
	res.render("table");
});*/

app.get("/table", function(req, res){
	var query="select * from patientsTbl";
	
	db.query(query, function(err, result){
		if (err)
			throw err;
		console.log("table data "+JSON.stringify(result));
		res.render("tableproto", {data: result});
	});
})

app.listen(port, function(){
	console.log("server listening on port "+port);
});