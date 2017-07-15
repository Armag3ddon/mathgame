define(['basic/entity', 'geo/v2', 'basic/text', 'basic/image', 'core/mouse', 'core/graphic', 'config/fonts', 'core/game'],
function(Entity, V2, TextEntity, ImageEntity, mouse, g, f, game) {
	g.add('img/meter.png');
	g.add('img/meter_indicator.png');

	function Meter(pos, callback, fixedPositions, fixedTexts, startVal) {
		this.width = 500;
		this.indicator_width = 94;
		this.mouse_threshold = 20;

		pos.x -= this.indicator_width/2;
		Entity.call(this, pos, new V2(this.width + this.indicator_width, 100));

		this.bg = new ImageEntity(new V2(this.indicator_width/2, 0), 'img/meter.png');
		this.indicator = new ImageEntity(Zero(), 'img/meter_indicator.png');
		this.display = new TextEntity(new V2(this.width + this.indicator_width, this.size.y/2), '', f.onscreen);

		this.value = 100;

		this.dragged = false;

		this.add(this.bg);
		this.add(this.indicator);
		this.add(this.display);

		this.callback = callback;
		this.fixedPositions = fixedPositions;
		this.fixedTexts = fixedTexts;
		if (startVal != undefined)
			this.setMeter(fixedPositions[startVal]);
		else
			this.setMeter(100);
	}

	Meter.prototype = new Entity();

	Meter.prototype.onMouseDown = function (p) {
		this.dragged = true;
		return true;
	};

	Meter.prototype.onMouseUp = function () {
		this.dragged = false;
		return true;
	};

	Meter.prototype.onUpdate = function (p) {
		if (this.dragged) {
			var x = mouse.x - this.parent.position.x - this.indicator_width/2;
			if (x < this.position.x) {
				this.setMeter(0);
				if (x < this.mouse_threshold) {
					this.dragged = false;
				}
			}
			else if(x > this.position.x + this.width)
				this.setMeter(100);
				if (x > this.position.x + this.width + this.mouse_threshold) {
					this.dragged = false;
				}
			else {
				x -= this.position.x;
				x /= this.width/100;
				x = Math.round(x);
				this.setMeter(x);
			}
			var y = Math.abs(mouse.y - this.parent.position.y - this.position.y + this.size.y/2);
			if (y > this.mouse_threshold * 4 + this.size.y/2)
				this.dragged = false;
		}
	};

	Meter.prototype.onDraw = function (ctx) {

	};

	Meter.prototype.setMeter = function (val) {
		if (val < 0) val = 0;
		if (val > 100) val = 100;
		this.value = val;

		if (this.fixedPositions) {
			var part = 100 / this.fixedPositions.length;
			var pos = 0;
			var closest = part;
			for (var i = 0; i < this.fixedPositions.length; i++) {
				var diff = this.fixedPositions[i] - val;
				if (Math.abs(diff) < closest) {
					pos = i;
					closest = Math.abs(diff);
				}
			}
			val = this.fixedPositions[pos];
			this.display.text = this.fixedTexts[pos];
			this.indicator.position.x = this.width / 100 * val;
			this.callback(pos);
		} else {
			this.display.text = val;
			this.indicator.position.x = this.width / 100 * val;
			this.callback(val);
		}
	};

	return Meter;
});
