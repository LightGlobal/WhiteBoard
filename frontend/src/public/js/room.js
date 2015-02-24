var doc = document;

doc.addEventListener('DOMContentLoaded', function(e) {
    var board = doc.querySelector('#board'),
        x, y;
    Drawboard.init(board);
    if(isOwner){
        var down = false,
            begin = false;
        board.addEventListener('mousedown', function(e){
            down = true;
            begin = true;
        }, false);
        board.addEventListener('mouseup', function(e){
            down = false;
            begin = false;
        });
        board.addEventListener('mousemove', function(e){
            //console.log(e.offsetX+':'+e.offsetY);
            if(down){
                x = e.offsetX;
                y = e.offsetY;
                Drawboard.draw(x, y, {begin: begin});
                socket.emit('draw', {x: x, y: y, begin: begin});
            };
            begin = false;
        });
        socket.on('getImg', function(msg){
            var dataUrl = board.toDataURL();
            socket.emit('initBoard', dataUrl);
        });
    }else{
        socket.on('draw', function(point){
            console.log(point.x+' : '+point.y);
            Drawboard.draw(point.x, point.y, {begin: point.begin});
        });
        socket.on('initBoard', function(dataUrl){
            var img = new Image();
            img.onload = function(){
                board.getContext('2d').drawImage(img, 0, 0);
            }
            img.src = dataUrl;
        });
    }
    // for(var i=0; i<100; i++){
    //     Drawboard.draw(i, i);
    // }
    // setTimeout(function() {
    //     for(var j=300, k=0; j>1; j--,k++){
    //         Drawboard.draw(j, k, {strokeStyle: '#F70101', lineWidth: 20});
    //     }
    //     //Drawboard.draw(300, 0, {strokeStyle: '#F70101'});
    // }, 1000);
}, false);