define(['lib/scene', 'geo/v2', 'core/graphic', 'core/sound', 'entity/controller', 'entity/typefield', 'lib/animation', 'definition/random', 'basic/image'],
		function(Scene, V2, g, s, Controller, TypeField, Animation, R, Image) {
			s.add('snd/eureka.mp3');
			s.add('snd/ohno.mp3');

            var between = R.betweenInt;

            var GFX = {
                GFX_BG : 'img/background.jpg',
                GFX_TT : 'img/tentacel_spritesheet.png',
                GFX_PROG : 'img/programmer_spritesheet_glow.png',
                GFX_PROG_STRESS : 'img/programmer_spritesheet_stressed.png',
                GFX_EUREKA : 'img/eureka_engineer.png',
                GFX_EUREKA_BUBBLE : 'img/eureka_bubble.png',
                GFX_OHNO : 'img/ohno_engineer.png',
                GFX_OHNO_BUBBLE : 'img/ohno_bubble.png',
                GFX_POPUPS : 'img/popup_spritesheet.png',
                GFX_TRIBBLE : 'img/tribble_spritesheet.png',
                GFX_WINDOW_ANIM : 'img/animation_window.png',
                GFX_WINDOW : 'img/window_overlay.png',
                GFX_SHIELD_0 : 'img/shield/shield_0.png',
                GFX_SHIELD_10 : 'img/shield/shield_10.png',
                GFX_SHIELD_20 : 'img/shield/shield_20.png',
                GFX_SHIELD_30 : 'img/shield/shield_30.png',
                GFX_SHIELD_40 : 'img/shield/shield_40.png',
                GFX_SHIELD_50 : 'img/shield/shield_50.png',
                GFX_SHIELD_60 : 'img/shield/shield_60.png',
                GFX_SHIELD_70 : 'img/shield/shield_70.png',
                GFX_SHIELD_80 : 'img/shield/shield_80.png',
                GFX_SHIELD_90 : 'img/shield/shield_90.png',
                GFX_SHIELD_100 : 'img/shield/shield_100.png',
                GFX_CABLES_TOP : 'img/cables_animation.png',
                GFX_COFFEE : 'img/KaffebecherRobo_spritesheet.png',
                GFX_METEOR : 'img/meteor_animation.png',
                GFX_PIPES: 'img/rohr_spritesheet.png',
                GFX_GOO : 'img/goo_animation.png'
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
                    anim : GFX.GFX_PROG_STRESS,
                    speed: 125,
					images: 24,
                    pos :  new V2(461, 360),
                    blink_speed: 250
                },
                panic : {
					name : 'panic',
                    anim : GFX.GFX_PROG_STRESS,
                    speed: 70,
					images: 24,
                    pos :  new V2(461, 360),
                    blink_speed: 100
                },
				eureka : {
					name : 'eureka',
					anim : GFX.GFX_EUREKA,
					speed : 1000,
					images : 1,
					pos : new V2(469, 336),
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
					pos : new V2(469, 336),
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
                },
                cables_top : {
                    anim : GFX.GFX_CABLES_TOP,
                    speed: 100,
                    images: 18,
                    pos :  new V2(149, 0)
                },
                coffee_cup: {
                    anim : GFX.GFX_COFFEE,
                    speed: 100,
                    images: 26,
                    pos :  new V2(308, 549),
                    still_frame: 0
                },
                meteor : {
                    anim : GFX.GFX_METEOR,
                    speed: 100,
                    images: 8,
                    pos :  new V2(1040, 70)
                },
                pipes: {
                    anim : GFX.GFX_PIPES,
                    speed: 100,
                    images: 26,
                    pos :  Zero()
                },
                goo: {
                    anim : GFX.GFX_GOO,
                    speed: 100,
                    images: 16,
                    pos :  new V2(33, 375)
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
                this.programmer_state_name = "normal";
				this.bubble_time = 0;
                this.setStateForProgrammer("normal");

                this.shield_display = new Image(new V2(827, 517), GFX.GFX_SHIELD_100);

                this.add(new Animation('window_anim', GFX.GFX_WINDOW_ANIM, new V2(1040, 70), 19, 100, true));
                this.add(new Image(new V2(1040, 70), GFX.GFX_WINDOW));
                this.add(this.shield_display);

                this.event = null;

                Object.keys(EVENTS).forEach(function(name) {
                    var e = EVENTS[name];
                    if (e.still_frame !== undefined) {
                        var anim = new Animation('still_' + e.anim, e.anim, e.pos, e.images, 0, false);
                        anim.frame = e.still_frame;
                        this.add(anim);
                    }
                }.bind(this));

                this._eureka_cooldown = 0;
                this.eureka_cooldown_time = 4000;
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

                    if (new_event.still_frame) {
                        this.entities.forEach(function(e) {
                           if (e.id === 'still_' + new_event.anim) {
                               e.hidden = true;
                           }
                        });
                    }
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
                this.programmer_state_name = state_name;
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
                if (this._eureka_cooldown < 0) {
                    this.setStateForProgrammer('eureka');
                    this._eureka_cooldown = this.eureka_cooldown_time;
                }
			};

			PlayScene.prototype.fail = function () {
				this.setStateForProgrammer('ohno');
			};

			PlayScene.prototype.onUpdate = function (delta) {
				if (this.bubble_time > 0) {
					this.bubble_time -= delta;
					if (this.bubble_time <= 0) {
						this.setStateForProgrammer(this.programmer_old, true);
						this.bubble_time = 0;
					}
				}

				var shield_val = Math.min(Math.max((Math.floor(this.controller.total_health_percent / 10) * 10), 0), 100);
				this.shield_display.img = g['img/shield/shield_' + shield_val + '.png'];

                if (shield_val < 60 && shield_val > 20) {
                    if (this.programmer_state_name !== "excited")
                        this.setStateForProgrammer("excited");
                } else if (shield_val <= 20) {
                    if (this.programmer_state_name !== "panic")
                        this.setStateForProgrammer("panic");
                } else {
                    if (this.programmer_state_name !== "normal")
                        this.setStateForProgrammer("normal");
                }

                this.entities.forEach(function(e) {
                    if (typeof e.isAnimation === 'function' && e.isAnimation() && e.id.indexOf('still') !== -1) {
                        var real_id = e.id.substr(6, e.id.length);
                        if (!this.entities.find(function(f) {
                            return f.id === real_id;
                        })) {
                            e.hidden = false;
                        } else {
                            e.hidden = true;
                        }

                    }
                }.bind(this));

                this._eureka_cooldown -= delta;
			};

			return PlayScene;
		}
);
