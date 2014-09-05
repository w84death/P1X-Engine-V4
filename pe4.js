/*
*
*
*   P1X, Krzysztof Jankowski
*   P1X Engine V4
*
*   abstract: Simple javascript engine for simple pixel art games
*   engine: P1X Engine V4
*   created: 23-08-2014
*   license: do what you want and dont bother me
*
*   webpage: http://p1x.in
*   twitter: @w84death
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/*
*
*   request animation, force 60fps rendering
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

/*
*
*   graphics functions
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var Gfx = function(){
    this.layers = [];
    this.screen = {
        width: null,
        height: null,
        scale: 4,
        sprite_size: 8,
    };
    var game_div = document.getElementById('game'),
        real_width = window.innerWidth > 1024 ? 1024 : window.innerWidth,
        real_height = window.innerHeight > 768 ? 768 : window.innerHeight;

    game_div.style.width = real_width + 'px';
    game_div.style.height = real_height + 'px';
    this.screen.width = (real_width/this.screen.scale)<<0;
    this.screen.height = (real_height/this.screen.scale)<<0;


};
Gfx.prototype.init = function(params){
    this.loaded = 0;
    this.sprites = {
        logo: new Image(),
        pointer: new Image(),
        tileset: new Image()
    };
    this.sprites.logo.src = 'sprites/logo.png';
    this.sprites.pointer.src = 'sprites/pointer.png';
    this.sprites.tileset.src = 'sprites/tileset.png';

    for (var key in this.sprites) {
        this.sprites[key].onload = function(){
            game.gfx.loaded++;
        };
    }

    for (var i = 0; i < params.layers; i++) {
        var canvas = document.createElement('canvas');
        canvas.width = this.screen.width*this.screen.scale;
        canvas.height = this.screen.height*this.screen.scale;

        var ctx = canvas.getContext("2d");
        ctx.mozImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;

        this.layers.push({
            canvas: canvas,
            ctx: ctx,
            render: false
        });

        document.getElementById('game').appendChild(canvas);
    };
};
Gfx.prototype.load = function(){
    var size = 0, key;
    for (key in this.sprites) {
        if (this.sprites.hasOwnProperty(key)) size++;
    }
    if(this.loaded >= size){
        return true;
    }
    return false;
};
Gfx.prototype.clear = function(layer){
    this.layers[layer].ctx.clearRect(
        0, 0,
        this.screen.width*this.screen.scale,
        this.screen.height*this.screen.scale
    );
};
Gfx.prototype.draw_tileset = function(){
    for (var i = 0; i < this.tileset_ids.length; i++) {
        this.put_tile({
            id:i, x:i, y:0, layer:1
        });
        this.layers[1].render = true;
    };
};
Gfx.prototype.put_tile = function(params){
    var sx,sy,
    _w = this.sprites.tileset.width / this.screen.sprite_size,
    _h = this.sprites.tileset.height / this.screen.sprite_size;

    if(params.id >= _w){
        sx = params.id % _w;
        sy = (params.id/_w)<<0;
    }else{
        sx = params.id;
        sy = 0;
    }

    this.layers[params.layer].ctx.drawImage(
        this.sprites.tileset,
        sx*this.screen.sprite_size,
        sy*this.screen.sprite_size,
        this.screen.sprite_size,
        this.screen.sprite_size,
        params.x*this.screen.sprite_size*this.screen.scale,
        params.y*this.screen.sprite_size*this.screen.scale,
        this.screen.sprite_size*this.screen.scale,
        this.screen.sprite_size*this.screen.scale
    );
};

/*
*
*   gui functions
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var Gui = function(){
    this.layer = null;
    this.bubbles = [];
    this.buttons = [];
};
Gui.prototype.init = function(params){
    this.layer = params.layer;

    this.add_button({
        x: game.world.width-3,
        y: 2,
        sprites: [23,22],
        changer: 'pause',
        fn: function(){
            game.pause = !game.pause;
        }
    });

};
Gui.prototype.zeros = function(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
};
Gui.prototype.clear = function(){
    game.gfx.layers[this.layer].ctx.clearRect(
        0, 0,
        game.gfx.screen.width*game.gfx.screen.scale,
        game.gfx.screen.height*game.gfx.screen.scale
    );
};
Gui.prototype.draw_image = function(params){
    var sx = params.x * game.gfx.screen.scale * game.gfx.screen.sprite_size,
        sy = params.y * game.gfx.screen.scale * game.gfx.screen.sprite_size,
        sprite = game.gfx.sprites[params.name];

    if(params.center){
        sx -= ((sprite.width * 0.5)<<0) * game.gfx.screen.scale;
        sy -= ((sprite.height * 0.5)<<0) * game.gfx.screen.scale;
    }

    game.gfx.layers[this.layer].ctx.drawImage(
        sprite,
        0,0,
        sprite.width,
        sprite.height,
        sx,
        sy,
        sprite.width * game.gfx.screen.scale,
        sprite.height * game.gfx.screen.scale
    );
};
Gui.prototype.draw_loading = function(params){
    var ctx = game.gfx.layers[this.layer].ctx,
        _w = game.gfx.screen.width*game.gfx.screen.scale,
        _h = game.gfx.screen.height*game.gfx.screen.scale;

    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = "900 "+(4*game.gfx.screen.scale)+"px 'Source Code Pro', monospace,serif";
    ctx.strokeStyle = '#fff';

    ctx.fillText('LOADING GAME..',
        _w*0.5 << 0,
        _h*0.5 << 0
    );
};
Gui.prototype.draw_fps = function(){
    var ctx = game.gfx.layers[this.layer].ctx;
    ctx.font = "900 "+(5* game.gfx.screen.scale)+"px 'Source Code Pro', monospace,serif";
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'right';
    ctx.fillText('FPS '+game.fps,
        (game.world.width  - 2) * game.gfx.screen.scale * game.gfx.screen.sprite_size,
        (game.world.height  -1 ) * game.gfx.screen.scale * game.gfx.screen.sprite_size
    );
};
Gui.prototype.draw_pointer = function(){
    var x = (game.input.pointer.pos.x ) << 0,
        y = (game.input.pointer.pos.y ) << 0;

    game.gfx.layers[this.layer].ctx.drawImage(
        game.gfx.sprites.pointer,
        game.input.pointer.enable? 8 : 0, // x cut
        0, // y cut
        8,8,x,y,8*game.gfx.screen.scale,8*game.gfx.screen.scale // cut size, position, sprite size
    );
};
Gui.prototype.add_button = function(params){
    this.buttons.push({
        pos: {
            x: params.x,
            y: params.y
        },
        sprites: params.sprites,
        changer: params.changer,
        fn: params.fn
    });
};
Gui.prototype.draw_buttons = function(){
    var key, btn;

    for(key in this.buttons){
        btn = this.buttons[key];

        game.gfx.put_tile({
            layer: this.layer,
            id: game[btn.changer] ? btn.sprites[0] : btn.sprites[1],
            x: btn.pos.x,
            y: btn.pos.y
        });
    }
};
Gui.prototype.button_clicked = function(x,y){
    var key, btn;

    for(key in this.buttons){
        btn = this.buttons[key];
        if(
            x >= btn.pos.x &&
            x < btn.pos.x + 1 &&
            y >= btn.pos.y &&
            y < btn.pos. y + 1
        ){
            btn.fn();
            return true;
        }
    }
    return false;
};
/*
*
*   input function
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var Input = function(){
    this.pointer = {
        enable: false,
        pos: {
            x: null,
            y: null
        }
    };
};
Input.prototype.init = function(){
    document.body.addEventListener('mousedown', this.enable_pointer, false);
    document.body.addEventListener('mouseup', this.disable_pointer, false);
    document.body.addEventListener('mousemove', this.track_pointer, false);
    document.body.addEventListener("contextmenu", function(e){
        e.preventDefault();
    }, false);
};
Input.prototype.enable_pointer = function(e){
    e.preventDefault();
    var x,y;
    if(e.touches){
        x = e.touches[0].pageX;
        y = e.touches[0].pageY;
    }else{
        x = e.pageX;
        y = e.pageY;
    }
    game.input.pointer.enable = true;
};
Input.prototype.disable_pointer = function(){
    game.input.pointer.enable = false;
};
Input.prototype.track_pointer = function(e){
    e.preventDefault();
    var x,y;
    if(e.touches){
        x = e.touches[0].pageX;
        y = e.touches[0].pageY;
    }else{
        x = e.pageX;
        y = e.pageY;
    }
    game.input.pointer.pos.x = x;
    game.input.pointer.pos.y = y;
};

/*
*
*   Messages / conversations / tutorials
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

Messages = function(){
    this.layer = null;
    this.bubbles = [];
};
Messages.prototype.init = function(params){
    this.layer = params.layer;
};
Messages.prototype.draw_message = function(params){
    var ctx = game.gfx.layers[this.layer].ctx,
        tile = 0, corner = {}, max_len = 0, len = 0, longest_line,
        width, height, i,x,y;

    ctx.fillStyle = '#000';
    ctx.font = "900 "+(5*game.gfx.screen.scale)+"px 'Source Code Pro', monospace,serif";
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    for (i = 0; i < params.msg.length; i++) {
        len = params.msg[i].length;
        if(len > max_len) {
            max_len = len;
            longest_line = i;
        }
    };
    longest_line = ctx.measureText(params.msg[longest_line]).width;

    width = ((longest_line/game.gfx.screen.sprite_size/game.gfx.screen.scale)<<0 )+2;
    height = i+1;
    if(width<2) width = 2;

    corner = {
        x: params.x - width,
        y: params.y - height + 1
    };

    game.gui.draw_box({
        layer: this.layer,
        width: width,
        height: height,
        x: corner.x,
        y: corner.y,
        sprites: [
            25,26,27,
            26,26,28,
            29,30,31
        ]
    });


    for (var i = 0; i < params.msg.length; i++) {
        ctx.fillText(params.msg[i],
            (corner.x*game.gfx.screen.sprite_size + 5 )*game.gfx.screen.scale ,
            ((corner.y+i)*game.gfx.screen.sprite_size + 4)*game.gfx.screen.scale
        );
    };
};
Messages.prototype.add_conversation = function(params){
    for (var i = 0; i < params.bubbles.length; i++) {
        this.bubbles.push({
            msg: params.bubbles[i],
            pos: {
                x:params.pos.x,
                y:params.pos.y
            },
            delay: i===0 ? params.delay || false : false,
            time: game.settings.conversation_time
        });
    };
};
Messages.prototype.draw_conversation = function(){
    var msg;

    if(this.bubbles.length > 0){
        bubble = this.bubbles[0];
        if(bubble.delay && bubble.delay < 0){
            if(bubble.time < 0){
                this.draw_message({
                    msg: bubble.msg,
                    x: bubble.pos.x,
                    y: bubble.pos.y
                });
                if(game.input.pointer.enable){
                    this.bubbles.splice(0,1);
                }
            }else{
                bubble.time--;
            }
        }else{
            bubble.delay--;
        }
    }
};

/*
*
*   sound generation
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

Moog = function(){
    this.audio = new (window.AudioContext || window.webkitAudioContext)();
};
Moog.prototype.play = function(params){
    if(params.pause) return;
    var vol = params.vol || 0.2,
        attack = params.attack || 20,
        decay = params.decay || 300,
        freq = params.freq || 30,
        oscilator = params.oscilator || 0;
        gain = this.audio.createGain(),
        osc = this.audio.createOscillator();

    // GAIN
    gain.connect(this.audio.destination);
    gain.gain.setValueAtTime(0, this.audio.currentTime);
    gain.gain.linearRampToValueAtTime(params.vol, this.audio.currentTime + attack / 1000);
    gain.gain.linearRampToValueAtTime(0, this.audio.currentTime + decay / 1000);

    // OSC
    osc.frequency.value = freq;
    osc.type = oscilator; //"square";
    osc.connect(gain);

    // START
    osc.start(0);

    setTimeout(function() {
        osc.stop(0);
        osc.disconnect(gain);
        gain.disconnect(game.moog.audio.destination);
    }, decay)
};

/*
*
*   main loop init
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var time,
    fps = 0,
    last_update = (new Date)*1 - 1,
    fps_filter = 30;

function game_loop() {
    requestAnimFrame(game_loop);

    var now = new Date().getTime(),
        delta_time = now - (time || now);
    time = now;

    var temp_frame_fps = 1000 / ((now=new Date) - last_update);
    fps += (temp_frame_fps - fps) / fps_filter;
    last_update = now;

    game.fps = fps.toFixed(1);
    game.loop(delta_time);
};