define(['lib/scene', 'geo/v2', 'core/graphic', 'entity/controller', 'entity/typefield', 'lib/animation', 'definition/random'],
		function(Scene, V2, g, Controller, TypeField, Animation, R) {
            var between = R.betweenInt;

			g.add('img/background wip.jpg');
            g.add('img/programmer_spritesheet.png');
            g.add('img/tentacel_spritesheet.png');

            var programmer_states = {
                normal : {
                    anim : 'img/programmer_spritesheet.png',
                    speed: 150,
                    pos :  new V2(520, 374),
                    blink_speed: 500
                },
                excited : {
                    anim : 'img/programmer_spritesheet.png',
                    speed: 70,
                    pos :  new V2(520, 374),
                    blink_speed: 250
                },
                panic : {
                    anim : 'img/programmer_spritesheet.png',
                    speed: 30,
                    pos :  new V2(520, 374),
                    blink_speed: 100
                }
            };

            function PlayScene() {
				Scene.call(this);

				this.controller = new Controller(Zero());
				this.add(this.controller);

				this.typefield = new TypeField(new V2(310, 380));
				this.add(this.typefield);
				this.keyAware.push(this.typefield);

				this.bg = 'img/background wip.jpg';

                this.programmer = null;
                this.setStateForProgrammer("normal");

                this.events = {
                    tentacles : {
                        anim : 'img/tentacel_spritesheet.png',
                        speed: 100,
                        images: 30,
                        pos :  new V2(50, 200)
                    }
                };

                this.event = null;
			}

			PlayScene.prototype = new Scene();

			PlayScene.prototype.processInput = function (input) {
				this.controller.processInput(input);
			};

            PlayScene.prototype.triggerRandomEvent = function() {
                var evts = Object.keys(this.events);
                var r = between(0, evts.length);
                this.event = this.events[evts[r]];

                this.add(new Animation(this.event.anim, this.event.pos, this.event.images, this.event.speed, false))
            };

            PlayScene.prototype.setStateForProgrammer = function(state_name) {
                this.programmer = programmer_states[state_name];
                this.typefield.blink_speed = this.programmer.blink_speed;

                this.remove(this.programmer_anim);
                this.programmer_anim = new Animation(this.programmer.anim, this.programmer.pos, 12, this.programmer.speed, true);
                this.add(this.programmer_anim);
            };

			return PlayScene;
		}
);
