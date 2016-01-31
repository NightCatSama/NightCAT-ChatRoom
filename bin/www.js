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
  var message = '';
    //监听用户发布聊天内容
    socket.on('message', function(obj){
        //向所有客户端广播发布的消息
        io.emit('message', obj);
        console.log(obj.username+'说：'+obj.message);
    });
    //  添加新用户并发布出去
    socket.on('update',function(obj){
        if(!online_people.people.some(function(item, index, array){
           return online_people.people[index]==obj})
        ){
        online_people.people.push(obj);
        online_people.number = online_people.number +1 ;
        
        setTimeout(function(){
          io.emit('update', online_people);
        },200);
        console.log('总人数为:'+online_people.number+'!人员名单为'+online_people.people);
        }
        else {
            setTimeout(function(){
               clearTimeout(timeoutFlag[obj]);
            io.emit('update', online_people);
            },200);
            console.log('总人数为:'+online_people.number+'!人员名单为'+online_people.people);
        }
    });

    //  监听用户退出并发布出去
    socket.on('exit',function(obj){
        clearTimeout(timeoutFlag[obj]);
        if(online_people.people.some(function(item, index, array){
           return online_people.people[index]==obj})
        )
        {
          timeoutFlag[obj] = setTimeout(function(){
            // console.log(online_people.people+'---减一之前---'+online_people.number)
            online_people.number = online_people.number -1 ;
            var index = online_people.people.indexOf(obj);
            online_people.people.splice(index,1);

            console.log("用户"+obj+"退出了聊天室");
            // console.log(online_people.people+'---减一之后---'+online_people.number)
          },4000);
        }
        // console.log(online_people.people+"---Exit消息收到了---"+obj);
        io.emit('update', online_people);
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
