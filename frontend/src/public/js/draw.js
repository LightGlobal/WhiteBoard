var Drawboard = (function(win) {
    var CANVAS,ctx;
    function init(canvas){
        CANVAS = canvas;
        if(CANVAS.getContext){
            ctx = CANVAS.getContext('2d');
            ctx.beginPath();
        }
    }
    function setting(options){
        for(option in options){
            if(options.hasOwnProperty(option)){
                ctx[option] = options[option];
            }
        }
    }
    function draw(x, y, options) {
        ctx.beginPath();
        setting(options);

        ctx.moveTo(x-((options&&options.lineWidth)||1), y-((options&&options.lineWidth)||1));
        ctx.lineTo(x, y);
        ctx.stroke();
    }
    return {
        CANVAS: CANVAS,
        init: init,
        setting: setting,
        draw: draw
    }
})(this);