define(['lib/scene', 'geo/v2', 'core/graphic', 'entity/controller', 'entity/typefield', 'lib/animation', 'definition/random'],
		function(Scene, V2, g, Controller, TypeField, Animation, R) {
            var between = R.betweenInt;

            var GFX = {
                GFX_BG : 'img/background.png',
                GFX_TT : 'img/tentacel_spritesheet.png',
                GFX_PROG : 'img/programmer_spritesheet_glow.png',
                GFX_POPUPS : 'img/popup_spritesheet.png'
            };

            Object.keys(GFX).forEach(function(k) {
                g.add(GFX[k]);
            });

            var programmer_states = {
                normal : {
                    anim : GFX.GFX_PROG,
                    speed: 150,
                    pos :  new V2(461, 360),
                    blink_speed: 500
                },
                excited : {
                    anim : GFX.GFX_PROG,
                    speed: 70,
                    pos :  new V2(461, 360),
                    blink_speed: 250
                },
                panic : {
                    anim : GFX.GFX_PROG,
                    speed: 30,
                    pos :  new V2(461, 360),
                    blink_speed: 100
                }
            };

            var EVENTS = {
                tentacles : {
                    anim : GFX.GFX_TT,
                    speed: 100,
                    images: 32,
                    pos :  new V2(103, 227)
                },
                popups : {
                    anim : GFX.GFX_POPUPS,
                    speed: 500,
                    images: 12,
                    pos :  new V2(47, 125)
                }
            };

            var getRandomEvent = function() {
                var evts = Object.keys(EVENTS),
                    r = between(0, evts.length);

                return EVENTS[evts[r]];
            };
            
            function PlayScene() {
				Scene.call(this);

				this.controller = new Controller(Zero());
				this.add(this.controller);

				this.typefield = new TypeField(new V2(310, 380));
				this.add(this.typefield);
				this.keyAware.push(this.typefield);

				this.bg = GFX.GFX_BG;

                this.programmer = null;
                this.setStateForProgrammer("normal");

                this.event = null;
			}

			PlayScene.prototype = new Scene();

			PlayScene.prototype.processInput = function (input) {
				this.controller.processInput(input);
			};

            PlayScene.prototype.triggerRandomEvent = function() {
                var new_event = getRandomEvent();

                var is_running = this.entities.filter(function(e) {
                    return typeof e.isAnimation === 'function' && e.isAnimation();
                }).find(function(e) {
                    return e.id === new_event.anim;
                });

                if (!is_running) {
                    this.event = new_event;
                    var evt = new Animation(new_event.anim, new_event.anim, new_event.pos, new_event.images, new_event.speed, false);
                    this.add(evt);
                }
            };

            PlayScene.prototype.setStateForProgrammer = function(state_name) {
                this.programmer = programmer_states[state_name];
                this.typefield.blink_speed = this.programmer.blink_speed;

                this.remove(this.programmer_anim);
                this.programmer_anim = new Animation("programmer", this.programmer.anim, this.programmer.pos, 12, this.programmer.speed, true);
                this.add(this.programmer_anim);
            };

			return PlayScene;
		}
);
