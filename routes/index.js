var url = require("url");
var queryString  = require("querystring");
var express = require('express');
var router = express.Router();

var flag = false;

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/Users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{alerttext : ""});
});

router.get('/chatroom', function(req, res, next) {
	var collection = db.get("userdata");
	var stringA = req.originalUrl;
	console.log(stringA+'>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
	username =  decodeURIComponent(stringA.substr(stringA.indexOf("?")+10));
	if(username!=''&&username!=null){flag=true;}
	collection.find({
	  "username" : username
	},function(err,docs){
	  if(docs==''||docs==null){
	  	flag=false;
	}
	});
	setTimeout(function(){
    if(flag){
    // res.redirect('./chatroom');
    res.render('chatroom',{ username : username });
	}
	else {res.redirect('error');}
	},200)
});

// router.get('/chatroom',function(req,res,next){
// 	res.render('chatroom', {username : username });
// })


router.use('/register',function(req,res,next) {
	res.render('register');
});

module.exports = router;
