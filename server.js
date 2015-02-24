var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cookie = require('cookie');
var md5 = require('./md5.js');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Room = require('./room.js');
var rooms = [];
var config = {
    path: '/whiteboard'
}
Array.prototype.contains = function(room, isCompareMd5Name){
    var ret;
    this.every(function(item){
        if(isCompareMd5Name){
            if(item.md5Name==room.md5Name){
                ret = item;
                return false;
            }
        }else{
            if(item.name==room.name){
                ret = item;
                return false;
            }
        }
        return true;
    });
    return ret;
}

app.engine('html', require('ejs').renderFile);

app.use(cookieParser());
app.use(session({
    resave: false,
    secret: 'keyboard cat',
    saveUninitialized: false,
    name: 'sid'
}));
app.use(config.path+'/public', express.static(__dirname+'/frontend/src/public'));

app.get(config.path+'/', htmlHandler('index'));
app.get(config.path+'/index', htmlHandler('index'));
app.get(config.path + '/createRoom', function(req, res){
    var sid = req.cookies.sid;
        name = req.query.name,
        md5Name = md5.hex_md5(name),
        newRoom = new Room(name, md5Name, sid),
        room = rooms.contains(newRoom);
        console.log('name:'+name+'  sid:'+sid);
    if(!!room){
        if(room.sid === sid){
            res.send({code: 0, data: {code: '000', md5Name: md5Name}});
        }else{
            res.send({code: 0, data: {code: '001'}});       //房间已经存在
        }
    }else{
        rooms.push(newRoom);
        res.send({code: 0, data: {code: '000', md5Name: md5Name}});       //房间创建成功
    }
});

app.get(config.path+'/room:md5Name', function(req, res){
    console.log(req.params.md5Name);
    var room = rooms.contains(new Room('a', md5Name, 'a'), true),
        isOwner = false;
    if(room){
        console.log('room.sid:'+ room.sid+' - '+req.cookies.sid)
        if(room.sid===req.cookies.sid){
            isOwner = true;
        }
    }else{  //房间不存在

    }
    res.render(__dirname+'/frontend/src/room.html',{
        isOwner: isOwner
    });
});

io.on('connection', function(socket) {
    console.log('a user connected');
    //console.log(cookieParser.JSONCookie(socket.handshake.headers.cookie));
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
    
    var cookies = cookie.parse(socket.handshake.headers.cookie||''),
        curSid = cookies.sid || '',
        md5Name,
        room;
    
    //console.log(socket.handshake.headers.cookie+':  '+md5Sid);
    
    socket.on('join', function(roomName){
        md5Name = roomName.substring(roomName.indexOf('room')+4,roomName.length);
        room = rooms.contains(new Room('a', md5Name, curSid), true);
        if(room){
            console.log('a user join '+room.name);
            socket.join(room.name);
            socket.broadcast.to(room.name).emit('getImg');
        }else{  //课室未创建
            console.log('no room md5Name '+md5Name);
        }
    });
    socket.on('draw', function(point){
        console.log('draw:'+point.x+'-'+point.y);
        socket.broadcast.to(room.name).emit('draw', point);
    });

    socket.on('initBoard', function(dataUrl){
        socket.broadcast.to(room.name).emit('initBoard', dataUrl);
    });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


function htmlHandler(html){
    return function(req, res){
        var sess = req.session;
        if(!sess.user){
            sess.user = 'derek'
        }
        //console.log(sess)
        //console.log(req.sessionID);
        res.sendFile(__dirname+'/frontend/src/'+html+'.html');
    }
}