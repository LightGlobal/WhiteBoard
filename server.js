var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var md5 = require('./md5.js');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./room.js');
var rooms = [];
Array.prototype.contains = function(room){
    var ret;
    this.every(function(item){
        if(item.name==room.name){
            ret = item;
            return false;
        }
        return true;
    });
    return ret;
}
app.use(cookieParser());
app.use(session({
    resave: false,
    secret: 'keyboard cat',
    saveUninitialized: false,
    name: 'sid'
}));
app.use('/public', express.static(__dirname+'/frontend/src/public'));

app.get('/', htmlHandler('index'));
app.get('/index', htmlHandler('index'));
app.get('/room', htmlHandler('room'));

app.get('/createRoom', function(req, res){
    var md5Sid = md5.hex_md5(req.cookies.sid),
        name = req.query.name,
        newRoom = new Room(name, md5Sid),
        room = rooms.contains(newRoom);
        console.log('name:'+name);
    if(!!room){
        if(room.md5Sid === md5Sid){
            res.send({code: 0, data: {code: '000', md5Sid: md5Sid}});
        }else{
            res.send({code: 0, data: {code: '001'}});       //房间已经存在
        }
    }else{
        rooms.push(newRoom);
        res.send({code: 0, data: {code: '000', md5Sid: md5Sid}});       //房间创建成功
    }
});

io.on('connection', function(socket) {
    console.log('a user connected');
    console.log(cookieParser.JSONCookie(socket.handshake.headers.cookie));
    // socket.on('createRoom', function(name){
    //     var newRoom = new Room(name, socket),
    //         room = rooms.contains(newRoom);
    //     if(!!room){
    //         socket.emit('exist', '该房间已经存在');
    //     }else{
    //         room.push(newRoom);
    //         socket.emit('createSuccess', '创建房间成功');
    //     }
    // });

    socket.on('join', function(id){

    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


function htmlHandler(html){
    return function(req, res){
        var sess = req.session;
        //console.log(req.headers.cookie);
        res.sendFile(__dirname+'/frontend/src/'+html+'.html');
    }
}