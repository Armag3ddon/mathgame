define(['basic/entity', 'geo/v2', 'basic/text', 'config/fonts'],
	function(Entity, V2, TextEntity, f)
	{
		function TypeField(pos) {
			Entity.call(this);
			this.position = pos;
			this.size = new V2(800, 15);

			this.text = "";
			this.underscore_added = true;
			this.blink_speed = 500;
			this.blink_time = 0;
			this.max_characters = 7;
			this.caught_keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'backspace', 'enter'];

			var font = f.onscreen;
			font.align = 'left';
			this.display = new TextEntity(Zero(), this.text, font);
			this.add(this.display);
		}

		TypeField.prototype = new Entity();

		TypeField.prototype.onUpdate = function (delta) {
			this.blink_time += delta;
			if (this.blink_time > this.blink_speed) {
				this.blink_time -= this.blink_speed;
				if (this.underscore_added) {
					this.underscore_added = false;
				} else {
					this.underscore_added = true;
				}
			}
		};

		TypeField.prototype.onDraw = function (ctx) {
			if (this.underscore_added) {
				this.display.text = ">" + this.text + "_";
			}
			else {
				this.display.text = ">" + this.text;
			}
		};

		TypeField.prototype.up = function (key) {
			if (this.caught_keys.indexOf(key) == -1) return;

			if (key == 'backspace') {
				this.text = this.text.slice(0, -1);
				return true;
			}

			if (key == 'enter') {
				if (this.text.length <= 0)
					return true;
				this.parent.processInput (parseInt(this.text));
				this.text = '';
				return true;
			}

			if (this.text.length >= this.max_characters)
				return true
			this.text = this.text + key;
			return true;
		};

		return TypeField;
	}
);
