/*
*
*
*   P1X, Krzysztof Jankowski
*   Untitled
*
*   abstract: game for the Ludum Dare 30 hackathon, "Connected worlds"
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
    this.screen.width = (window.innerWidth/this.screen.scale)<<0;
    this.screen.height = (window.innerHeight/this.screen.scale)<<0;
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
        canvas.width = this.screen.width;
        canvas.height = this.screen.height;
        var ctx = canvas.getContext("2d");
        this.layers.push({
            canvas: canvas,
            ctx: ctx,
            render: false
        });
        canvas.style.webkitTransform = ' scale('+this.screen.scale+')';
        document.getElementById('game').appendChild(canvas);
    };
};
Gfx.prototype.load = function(){
    var size = 0, key;
    for (key in this.sprites) {
        if (this.sprites.hasOwnProperty(key)) size++;
    }
    if(this.loaded >= size){
        game.gfx.init_tileset();
        return true;
    }
    return false;
};
Gfx.prototype.clear = function(layer){
    this.layers[layer].ctx.clearRect(
        0, 0,
        this.screen.width, this.screen.height
    );
};
Gfx.prototype.init_tileset = function(){
    var canvas = document.createElement('canvas');
    canvas.width = this.sprites.tileset.width;
    canvas.height = this.sprites.tileset.height;
    var ctx = canvas.getContext("2d");

    ctx.drawImage(this.sprites.tileset,0,0);

    this.tileset = [];
    for (var y = 0; y < canvas.height/this.screen.sprite_size; y++) {
        for (var x = 0; x < canvas.width/this.screen.sprite_size; x++) {
            this.tileset.push(
                ctx.getImageData(
                    game.gfx.screen.sprite_size * x,
                    game.gfx.screen.sprite_size * y,
                    game.gfx.screen.sprite_size,
                    game.gfx.screen.sprite_size
                )
            );
        }
    }
};
Gfx.prototype.draw_tileset = function(){
    for (var i = 0; i < this.tileset.length; i++) {
        this.put_tile({
            id:i, x:i, y:0, layer:1
        });
        this.gfx.layers[1].render = true;
    };
};
Gfx.prototype.put_tile = function(params){
    this.layers[params.layer].ctx.putImageData(
        this.tileset[params.id],
        params.x*this.screen.sprite_size,
        params.y*this.screen.sprite_size
    );
};

/*
*
*   gui functions
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

var Gui = function(){};
Gui.prototype.init = function(params){
    this.layer = params.layer;
    this.bubbles = [];
};
Gui.prototype.clear = function(){
    game.gfx.layers[this.layer].ctx.clearRect(
        0, 0,
        game.gfx.screen.width, game.gfx.screen.height
    );
};
Gui.prototype.draw_logo = function(params){
    game.gfx.layers[this.layer].ctx.drawImage(
        game.gfx.sprites.logo,
        (params.x*game.gfx.screen.sprite_size)-(game.gfx.sprites.logo.width*0.5),
        (params.y*game.gfx.screen.sprite_size)-(game.gfx.sprites.logo.height*0.5)
    );
};
Gui.prototype.draw_intro = function(params){
    var ctx = game.gfx.layers[this.layer].ctx;

    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = "900 11px 'Source Code Pro', monospace,serif";
    ctx.strokeStyle = '#fff';

    ctx.fillText('P1X PRESENTS',
        game.gfx.screen.width*0.5 << 0,
        (game.gfx.screen.height*0.5 << 0) - 36
    );

    ctx.drawImage(game.gfx.sprites.logo,
        (game.gfx.screen.width*0.5 << 0)-(game.gfx.sprites.logo.width*0.5),
        ((game.gfx.screen.height*0.5 << 0)-(game.gfx.sprites.logo.height*0.5))-20
    );

    ctx.beginPath();
    ctx.moveTo(24,(game.gfx.screen.height*0.5 << 0));
    ctx.lineTo(game.gfx.screen.width-24,(game.gfx.screen.height*0.5 << 0));
    ctx.stroke();

    ctx.fillText('8X8 SPRITES; 16 COLOUR PALETTE',
        game.gfx.screen.width*0.5 << 0,
        (game.gfx.screen.height*0.5 << 0)+18
    );

    game.gfx.layers[this.layer].ctx.fillText('P1X ENGINE V4; HTTP://P1X.IN',
        game.gfx.screen.width*0.5 << 0,
        (game.gfx.screen.height*0.5 << 0)+32
    );

    ctx.fillText('@W84DEATH',
        game.gfx.screen.width*0.5 << 0,
        (game.gfx.screen.height*0.5 << 0)+48
    );

    ctx.beginPath();
    ctx.moveTo(24,(game.gfx.screen.height*0.5 << 0) + 56);
    ctx.lineTo(game.gfx.screen.width-24,(game.gfx.screen.height*0.5 << 0) + 56);
    ctx.stroke();

    if(game.timer % 2 == 1){
        ctx.fillText('CLICK TO START',
            game.gfx.screen.width*0.5 << 0,
            (game.gfx.screen.height*0.5 << 0) + 74
        );
    }
};
Gui.prototype.draw_fps = function(){
    var ctx = game.gfx.layers[this.layer].ctx;
    ctx.fillStyle = '#000';
    ctx.fillRect(
        game.gfx.screen.width-(7*game.gfx.screen.sprite_size),
        game.gfx.screen.height-(2*game.gfx.screen.sprite_size),
        game.gfx.screen.sprite_size*6,
        game.gfx.screen.sprite_size);
    ctx.fillStyle = '#fff';
    ctx.font = "900 9px 'Source Code Pro', monospace,serif";
    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'right';
    ctx.fillText('FPS '+game.fps,
        game.gfx.screen.width-game.gfx.screen.sprite_size-2,
        game.gfx.screen.height-game.gfx.screen.sprite_size+1
    );
};
Gui.prototype.draw_pointer = function(){
    var x = (game.input.pointer.pos.x / game.gfx.screen.scale) << 0,
        y = (game.input.pointer.pos.y / game.gfx.screen.scale) << 0;

    game.gfx.layers[this.layer].ctx.drawImage(
        game.gfx.sprites.pointer,
        game.input.pointer.enable? 8 : 0, // x cut
        0, // y cut
        8,8,x,y,8,8 // cut size, position, sprite size
    );
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
*   main game mechanics
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


var game = {

    gfx: new Gfx(),
    gui: new Gui(),
    input: new Input(),

    fps: 0,
    world: {
        width: null,
        height: null,
    },
    state: 'loading',
    timer: 0,

    settings:{
        water_animations: 36,
        conversation_time: 30
    },

    /*
    *   init the engine
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    init: function(){
        // game world size (for now as big as screen)
        this.world.width = (this.gfx.screen.width/this.gfx.screen.sprite_size)<<0;
        this.world.height = (this.gfx.screen.height/this.gfx.screen.sprite_size)<<0;

        // init game timer
        window.setInterval(game.inc_timer,500);

        // graphics init
        this.gfx.init({
            layers: 4
        });

        // gui init
        this.gui.init({
            layer: 3
        })

        // mouse events
        this.input.init();
    },

    /*
    *   game logic
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    inc_timer: function(){
        game.timer++;
    },

    new_game: function(){

    },

    update: function(delta_time){

        switch(this.state){
            case 'loading':
                if(this.gfx.load()){
                    this.gfx.layers[0].render = true;
                    this.state = 'intro';
                }
            break;
            case 'intro':
                if(this.input.pointer.enable){
                    this.new_game();
                    this.state = 'game';
                }
            break;
            case 'game':

                // ?

            break;
            case 'game_over':
                if(this.input.pointer.enable){
                    this.new_game();
                    this.state = 'game';
                }
            break;
        }

    },

     render: function(delta_time){
        this.gui.clear();
        var i,x,y;

        switch(this.state){
            case 'loading':
            break;
            case 'intro':
                if(this.gfx.layers[0].render){
                    for (x = 0; x < this.world.width; x++) {
                        for (y = 0; y < this.world.height; y++) {
                            this.gfx.put_tile({
                                layer:0,
                                id:0,
                                x:x,y:y
                            });
                        };
                    };
                    this.gfx.layers[0].render = false;
                }
                this.gui.draw_intro();
            break;
            case 'game':
                this.gui.draw_fps();
                this.gui.draw_logo({x:3,y:this.world.height-2});
            break;
            case 'game_over':
            break;
        }
        this.gui.draw_pointer();
    },


    /*
    *   main loop
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    loop: function(delta_time){
        this.update(delta_time);
        this.render(delta_time);
    },

};

game.init();

var time,
    fps = 0,
    last_update = (new Date)*1 - 1,
    fps_filter = 30;

(function game_loop() {
    requestAnimFrame(game_loop);

    var now = new Date().getTime(),
        delta_time = now - (time || now);
    time = now;

    var temp_frame_fps = 1000 / ((now=new Date) - last_update);
    fps += (temp_frame_fps - fps) / fps_filter;
    last_update = now;

    game.fps = fps.toFixed(1);
    game.loop(delta_time);
})();

