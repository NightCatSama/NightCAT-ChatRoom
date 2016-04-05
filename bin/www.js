#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('me:server');
var http = require('http');


var routes = require('../routes/index');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

 //  socket.io module

var io = require('socket.io').listen(server);
var fs = require('fs');

var online_people = {
  number: 0,
  people: []
};
var timeoutFlag = {};


io.sockets.on('connection', function (socket) {
  var message = ''
  var name = ''
    //监听用户发布聊天内容
    socket.on('message', function(obj){
        //向所有客户端广播发布的消息
        io.emit('message', obj)
        console.log(obj.username+'说：'+obj.message)
    })
    //  添加新用户并发布出去
    socket.on('update',function(obj){
        if(!online_people.people.some(function(item, index, array){
           return online_people.people[index]==obj})
        ){ 
            name = obj;
            online_people.people.push(obj)
            online_people.number = online_people.number +1 
        }
        io.emit('update', online_people)
        console.log('总人数为:'+online_people.number+'     人员名单为'+online_people.people)
    })

  // 接收图片
  socket.on('img',function(obj){
    socket.broadcast.emit('img',obj)
  })
  
  // 用户退出聊天室时
  socket.on('disconnect', function() {
      if(online_people.people.some(function(item, index, array){
         return online_people.people[index]==name
        })
      ){
        online_people.number = online_people.number - 1 
        var index = online_people.people.indexOf(name)
        online_people.people.splice(index,1)

        console.log(name+"退出了聊天室")

        io.emit('update', online_people)
      }
  });
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
