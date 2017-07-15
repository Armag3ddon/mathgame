define(['basic/entity', 'geo/v2', 'basic/text', 'basic/image', 'lib/animation', 'config/fonts', 'core/graphic'],
	function(Entity, V2, TextEntity, ImageEntity, AnimationEntity, f, g) {
		g.add('img/checkbox.png');

		function Checkbox(pos, text, checked, func) {
			Entity.call(this);
			this.position = pos;
			this.width = 94;

			this.box = new AnimationEntity('img/checkbox.png', 'img/checkbox.png', Zero(), 2, 0);
			this.checked = false;
			if (checked) {
				this.checked = true;
				this.box.frame = 1;
			}
			this.action = func;

			this.add(this.box);
			this.add ( new TextEntity(new V2(this.width, this.width/2), text, f.onscreen_left) );
		}

		Checkbox.prototype = new Entity();

		Checkbox.prototype.onClick = function () {
			if (this.checked) {
				this.checked = false;
				this.box.frame = 0;
			} else {
				this.checked = true;
				this.box.frame = 1;
			}
			if (this.action)
				this.action(this.checked);
		};

		return Checkbox;
	}
);
