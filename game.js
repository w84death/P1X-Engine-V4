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
*   custom GUI draw functions
*
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
Gui.prototype.draw_intro = function(params){
    var ctx = game.gfx.layers[this.layer].ctx,
        _w = game.gfx.screen.width*game.gfx.screen.scale,
        _h = game.gfx.screen.height*game.gfx.screen.scale;

    ctx.textBaseline = 'bottom';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.font = "900 "+(4*game.gfx.screen.scale)+"px 'Source Code Pro', monospace,serif";
    ctx.strokeStyle = '#fff';

    ctx.fillText('P1X PRESENTS',
        _w*0.5 << 0,
        (_h*0.5 << 0) - 112
    );

    this.draw_image({
        name: 'logo',
        x:(game.world.width*0.5 << 0),
        y:(game.world.height*0.5 << 0)-2,
        center: true
    });

    ctx.beginPath();
    ctx.moveTo(24,(_h*0.5 << 0)-12);
    ctx.lineTo(_w-24,(_h*0.5 << 0)-12);
    ctx.stroke();

    ctx.fillText('8X8 SPRITES; 16 COLOUR PALETTE',
        (_w*0.5 << 0),
        (_h*0.5 << 0)+18
    );

    game.gfx.layers[this.layer].ctx.fillText('P1X ENGINE V4; HTTP://P1X.IN',
        (_w*0.5 << 0),
        (_h*0.5 << 0)+32
    );

    ctx.fillText('@W84DEATH',
        (_w*0.5 << 0),
        (_h*0.5 << 0)+48
    );

    ctx.beginPath();
    ctx.moveTo(24,(_h*0.5 << 0)+ 56);
    ctx.lineTo(_w-24,(_h*0.5 << 0)+ 56);
    ctx.stroke();

    if(game.timer % 2 == 1){
        ctx.fillText('CLICK TO START',
            _w*0.5 << 0,
            (_h*0.5 << 0) + 84
        );
    }
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
    moog: new Moog(),
    messages: new Messages(),

    fps: 0,
    state: 'loading',
    timer: 0,

    settings:{
        game_clock: 500,
        conversation_time: 30
    },

    world: {
        width: null,
        height: null,
        data: [],
        entities: []
    },



    /*
    *   init the engine
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    init: function(){
        // game world size (for now as big as screen)
        this.world.width = (this.gfx.screen.width/this.gfx.screen.sprite_size)<<0;
        this.world.height = (this.gfx.screen.height/this.gfx.screen.sprite_size)<<0;

        // init game timer
        window.setInterval(game.inc_timer,game.settings.game_clock);

        // graphics init
        this.gfx.init({
            layers: 4
        });

        // gui init
        this.gui.init({
            layer: 3
        });

        // messages init
        this.messages.init({
            layer: 3
        });

        // mouse events
        this.input.init();

        // play some sound
        game.moog.play({
            freq: 5000,
            attack: 80,
            decay: 400,
            oscilator: 3,
            vol: 0.2
        });

        game_loop();
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
                this.gui.draw_image({
                    name: 'logo',
                    x:1,
                    y:this.world.height-3});
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


/*
*   init game and loop
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
game.init();
