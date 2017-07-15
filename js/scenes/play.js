define(['lib/scene', 'geo/v2', 'core/graphic', 'entity/controller', 'entity/typefield', 'lib/animation', 'definition/random'],
		function(Scene, V2, g, Controller, TypeField, Animation, R) {
            var between = R.betweenInt;

			g.add('img/background wip.jpg');
            g.add('img/programmer_spritesheet.png');
            g.add('img/tentacel_spritesheet.png');

			function PlayScene() {
				Scene.call(this);

				this.controller = new Controller(Zero());
				this.add(this.controller);

				this.typefield = new TypeField(new V2(310, 380));
				this.add(this.typefield);
				this.keyAware.push(this.typefield);

				this.bg = 'img/background wip.jpg';

                var programmer_states = {
                    normal : {
                        anim : 'img/programmer_spritesheet.png',
                        speed: 100,
                        pos :  new V2(520, 374)
                    },
                    excited : {
                        anim : 'img/programmer_spritesheet.png',
                        speed: 30,
                        pos :  new V2(520, 374)
                    },
                    paniced : {
                        anim : 'img/programmer_spritesheet.png',
                        speed: 1,
                        pos :  new V2(520, 374)
                    }
                };

                this.programmer_state = "normal";
                this.programmer = programmer_states[this.programmer_state];

                this.add(new Animation(this.programmer.anim, this.programmer.pos, 12, this.programmer.speed, true));

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

			return PlayScene;
		}
);
