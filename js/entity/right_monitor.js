define(['basic/entity', 'geo/v2', 'basic/text', 'config/fonts', 'definition/random'],
    function(Entity, V2, TextEntity, f, R)
    {
        function RightMonitor(pos, options) {
            Entity.call(this, pos, options.size);

            var font = f.onscreen;

            this.options = options;
            this.text = 'Combo modifier:';
            this.display = new TextEntity(Zero(), this.text, font);
			this.display.frameColor = '#f0f80a';
			this.flicker_buffer = 0;

            this.add(this.display);

            this.time_to_new_modifier = 4343;
            this._time_number = 100;
        }

        RightMonitor.prototype = new Entity();

        RightMonitor.prototype.onUpdate = function (delta) {

            if (this._time_number < 0) {
                this.addNewModifier();
                this._time_number = this.time_to_new_modifier;
                this.time_to_new_modifier = 3000 + R.betweenInt(1000, 4000);
				this.flicker_buffer = 0;
				this.display.effectFrame = false;
            } else if (this._time_number <= 800) {
				this.flicker_buffer += delta;
				if (this.flicker_buffer <= 100) {
					this.display.effectFrame = true;
				} else {
					this.display.effectFrame = false;
					if (this.flicker_buffer >= 200)
						this.flicker_buffer = 0;
				}
			}

            this._time_number -= delta;
        };

        RightMonitor.prototype.addNewModifier = function() {
            this.display.text = 'Modifier: ' + this.parent.getNewComboModifier();
            this.center(this.display);
        };

        return RightMonitor;
    }
);
