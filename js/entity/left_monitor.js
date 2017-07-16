define(['basic/entity', 'geo/v2', 'basic/text', 'config/fonts', 'lib/animation', 'core/graphic'],
    function(Entity, V2, TextEntity, f, Animation, g)
    {
		g.add('img/distort_animation.png');

        function LeftMonitor(pos, options) {
            Entity.call(this, pos);

            this.options = options;

            //this.display = new TextEntity(Zero(), this.text, font);

            this.numbers = [];

			this.blocked = new Animation('Distort', 'img/distort_animation.png', new V2(-222, -20), 4, 200, true);

            this.time_to_new_number = 650;
            this._time_number = 0;
        }

        LeftMonitor.prototype = new Entity();

        LeftMonitor.prototype.onUpdate = function (delta) {
            if (this._time_number <= 0) {
                this.addNumber();

                this._time_number = this.time_to_new_number;
            }

            this.entities.forEach(function(e) {
                e.position.x -= 1;
            }.bind(this));

            this.entities = this.entities.filter(function(e) {
                return e.position.x > -225;
            });

            this._time_number -= delta;
        };

        LeftMonitor.prototype.addNumber = function() {
            var font = f.onscreen;
            var res = this.parent.getNumberForMonitor();
            var t = new TextEntity(new V2(-5,0), res.val, font);
            if (!res.real) {
                t.override_color = '#aa0000'
            }
            this.add(t);
        };

		LeftMonitor.prototype.addBlock = function() {
			this.block(this.blocked);
		};

		LeftMonitor.prototype.removeBlock = function () {
			this.remove(this.blocked);
		};

        return LeftMonitor;
    }
);
