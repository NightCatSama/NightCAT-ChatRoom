var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("<form action='/users/text' method='POST'>"+"<input type='text' name='text'>"+"<input type='submit'>"+"</form>");
});

router.post('/text',function(req,res,next) {
	res.send("你刚刚输入的是:→"+req.body.text);
})

module.exports = router;
