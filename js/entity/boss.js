define(['basic/entity', 'geo/v2', 'basic/text', 'config/fonts'],
    function(Entity, V2, TextEntity, f)
    {

        // A boss has multiple calculations that have to be solved
        // and does not go away until all solved
        function Boss(pos, options) {
            Entity.call(this, pos);

            var font = f.onscreen;

            this.options = options;

            this.operations = options.operations;

            this.text = '';
            this.operations.forEach(function(op) {
                this.text += ['(', op.op_1, op.operator, op.op_2, ')', '+'].join('');
            }.bind(this));

            // remove trailing +
            this.text = this.text.substr(0, this.text.length - 1);

            console.log(this.text);

            this.display = new TextEntity(Zero(), this.text, font);

            this.result = eval(this.text);
			this.dead = false;
			this.dieing_time = 2000;

            this.add(this.display);
        }

        Boss.prototype = new Entity();

        Boss.prototype.isBoss = function() {
            return true;
        };

        Boss.prototype.onUpdate = function (delta) {
            var s = delta > 0 ? new V2(this.options.speed.x / delta, this.options.speed.y / delta) : 0;
            this.position.add(s);

            this.parent.checkEntityForBounds(this, this.position);

			if (this.dead) {
				this.dieing_time -= delta;
				var new_color = this.lerpColor(f.onscreen.color, '#aa0000', 1 - this.dieing_time/2000);
				this.display.override_color = new_color;
				if (this.dieing_time <= 0) {
					this.parent.removeFromDieing(this);
				}
			}
        };

		// linear interpolation of one hex to another
		Boss.prototype.lerpColor = function (a, b, amount) {
			if (amount < 0)
				amount = 0;
			var ah = parseInt(a.replace(/#/g, ''), 16),
			ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
			bh = parseInt(b.replace(/#/g, ''), 16),
			br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
			rr = ar + amount * (br - ar),
			rg = ag + amount * (bg - ag),
			rb = ab + amount * (bb - ab);
			return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
		}

        Boss.prototype.isHitBy = function(val) {
			if (val === this.result) {
				this.parent.addToDieing(this);
				this.dead = true;
				this.display.text = this.result;
				this.options.speed = Zero();
				return true;
			}
            return false;
        };

        return Boss;
    }
);
