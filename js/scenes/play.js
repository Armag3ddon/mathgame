define(['lib/scene', 'geo/v2', 'core/graphic', 'core/sound', 'entity/controller', 'entity/typefield', 'lib/animation', 'definition/random', 'basic/image'],
		function(Scene, V2, g, s, Controller, TypeField, Animation, R, Image) {
			s.add('snd/eureka.mp3');
			s.add('snd/ohno.mp3');

            var between = R.betweenInt;

            var GFX = {
                GFX_BG : 'img/background.jpg',
                GFX_TT : 'img/tentacel_spritesheet.png',
                GFX_PROG : 'img/programmer_spritesheet_glow.png',
                GFX_EUREKA : 'img/eureka_engineer.png',
                GFX_EUREKA_BUBBLE : 'img/eureka_bubble.png',
                GFX_OHNO : 'img/ohno_engineer.png',
                GFX_OHNO_BUBBLE : 'img/ohno_bubble.png',
                GFX_POPUPS : 'img/popup_spritesheet.png',
                GFX_TRIBBLE : 'img/tribble_spritesheet.png',
                GFX_WINDOW_ANIM : 'img/animation_window.png',
                GFX_WINDOW : 'img/window_overlay.png'
            };

            Object.keys(GFX).forEach(function(k) {
                g.add(GFX[k]);
            });

            var programmer_states = {
                normal : {
					name : 'normal',
                    anim : GFX.GFX_PROG,
                    speed: 150,
					images: 12,
                    pos :  new V2(461, 360),
                    blink_speed: 500
                },
                excited : {
					name : 'excited',
                    anim : GFX.GFX_PROG,
                    speed: 70,
					images: 12,
                    pos :  new V2(461, 360),
                    blink_speed: 250
                },
                panic : {
					name : 'panic',
                    anim : GFX.GFX_PROG,
                    speed: 30,
					images: 12,
                    pos :  new V2(461, 360),
                    blink_speed: 100
                },
				eureka : {
					name : 'eureka',
					anim : GFX.GFX_EUREKA,
					speed : 1000,
					images : 1,
					pos : new V2(486, 309),
					bubble : GFX.GFX_EUREKA_BUBBLE,
					bubble_pos : new V2(491, 159),
					temp : true,
					sound : 'snd/eureka.mp3'
				},
				ohno : {
					name : 'ohno',
					anim : GFX.GFX_OHNO,
					speed : 1000,
					images : 1,
					pos : new V2(486, 309),
					bubble : GFX.GFX_OHNO_BUBBLE,
					bubble_pos : new V2(491, 159),
					temp : true,
					sound : 'snd/ohno.mp3'
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
                },
                tribble : {
                    anim : GFX.GFX_TRIBBLE,
                    speed: 100,
                    images: 12,
                    pos :  new V2(1040, 70)
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
				this.bubble_time = 0;
                this.setStateForProgrammer("normal");

                this.add(new Animation('window_anim', GFX.GFX_WINDOW_ANIM, new V2(1040, 70), 19, 100, true));
                this.add(new Image(new V2(1040, 70), GFX.GFX_WINDOW));

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

            PlayScene.prototype.setStateForProgrammer = function(state_name, forced) {
				if (this.programmer_old && !forced) {
					if (programmer_states[state_name].temp)
						return;
					this.programmer_old = programmer_states[state_name].name;
					return;
				}
				if (programmer_states[state_name].temp) {
					this.programmer_old = this.programmer.name;
				} else {
					this.programmer_old = null;
				}
                this.programmer = programmer_states[state_name];
				if (this.programmer.blink_speed)
					this.typefield.blink_speed = this.programmer.blink_speed;

				if (this.programmer.bubble) {
					this.programmer_bubble = new Animation("bubble", this.programmer.bubble, this.programmer.bubble_pos, 1, this.programmer.speed, false);
					this.add(this.programmer_bubble);
					this.bubble_time = this.programmer.speed;
				}

				if (this.programmer.sound) {
					s.play(this.programmer.sound);
				}

                this.remove(this.programmer_anim);
                this.programmer_anim = new Animation("programmer", this.programmer.anim, this.programmer.pos, this.programmer.images, this.programmer.speed, true);
                this.add(this.programmer_anim);
            };

			PlayScene.prototype.success = function () {
				this.setStateForProgrammer('eureka');
			}

			PlayScene.prototype.fail = function () {
				this.setStateForProgrammer('ohno');
			}

			PlayScene.prototype.onUpdate = function (delta) {
				if (this.bubble_time > 0) {
					this.bubble_time -= delta;
					if (this.bubble_time <= 0) {
						this.setStateForProgrammer(this.programmer_old, true);
						this.bubble_time = 0;
					}
				}
			}

			return PlayScene;
		}
);
