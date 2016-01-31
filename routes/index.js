var url = require("url");
var queryString  = require("querystring");
var express = require('express');
var router = express.Router();

var flag = false;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{alerttext : ""});
});

router.get('/chatroom', function(req, res, next) {
	var stringA = req.originalUrl;
	// console.log(stringA+'<<<<<<<<<<<<<<<<<<<<<<<<<')
	username = stringA.substr(stringA.indexOf("?")+10);
	username = decodeURIComponent(username);
	console.log(username+'<<<<<<<<<<<<<<<<<<<<<<<<<')
	if(username!=''&&username!=null){flag=true;};
    if(flag){
    // res.redirect('./chatroom');
    res.render('chatroom',{ username : username });
	}
	else {res.redirect('error');}
});

// router.get('/chatroom',function(req,res,next){
// 	res.render('chatroom', {username : username });
// })


router.use('/register',function(req,res,next) {
	res.render('register');
});

module.exports = router;
