document.addEventListener('DOMContentLoaded', function() {
    var doc = document,
        roomEle = doc.querySelector('#room');
        showLinkEle = doc.querySelector('.link-for-participant'),
        createBtn = doc.querySelector('.create-btn');
    createBtn.addEventListener('click', function(e) {
        var roomName = roomEle.value;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            var res, url;
            if(xhr.readyState === 4){
                if(xhr.status === 200){
                    console.log(xhr.responseText);
                    res = JSON.parse(xhr.responseText);
                    if(res.data.code=='001'){
                        alert('该课室名已被创建');
                    }else{
                        url = 'http://'+window.location.host+'/whiteboard/room'+res.data.md5Name;
                        showLinkEle.innerHTML = '转到创建的课室，并把该链接分享给朋友<a href="'+url+'">'+url+'</a>';
                    }
                }
            }
        }
        xhr.open('GET', 'createRoom?name='+encodeURIComponent(roomName));
        xhr.send();
    }, false);
}, false);