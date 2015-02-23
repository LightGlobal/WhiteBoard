var doc = document;

doc.addEventListener('DOMContentLoaded', function(e) {
    var board = doc.querySelector('#board');
    Drawboard.init(board);
    for(var i=0; i<100; i++){
        Drawboard.draw(i, i);
    }
    setTimeout(function() {
        for(var j=300, k=0; j>1; j--,k++){
            Drawboard.draw(j, k, {strokeStyle: '#F70101', lineWidth: 20});
        }
        //Drawboard.draw(300, 0, {strokeStyle: '#F70101'});
    }, 1000)
}, false);