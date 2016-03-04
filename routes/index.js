var url = require("url")
var queryString  = require("querystring")
var express = require('express')
var router = express.Router()

var flag = false

var mongo = require('mongodb')
var monk = require('monk')
var db = monk('localhost:27017/Users')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{alerttext : ""})
})

router.get('/chatroom', function(req, res, next) {
	var queryUrl = url.parse(req.url).query
	var username = ''
	var collection = db.get("userdata")
	var UID =  queryString.parse(queryUrl).UID
	if(UID!=''&&UID!=null){flag=true}
	collection.find({
    	"UID" : UID
	},function(err,docs){
	  if(docs==''||docs==null){
	  	flag=false
		} 
	else { username = docs[0].username }
	})
	setTimeout(function(){
    if(flag){
    res.render('chatroom',{ username : username })
	}
	else {res.redirect('error')}
	},200)
})

router.use('/register',function(req,res,next) {
	res.render('register')
})

module.exports = router
