define(['basic/entity', 'geo/v2', 'basic/text', 'basic/image', 'lib/animation', 'config/fonts', 'core/graphic', 'core/sound'],
	function(Entity, V2, TextEntity, ImageEntity, AnimationEntity, f, g, s) {
		g.add('img/checkbox.png');
		g.add('img/switch_on.png');
		g.add('img/switch_off.png');
		s.add('snd/click.mp3');

		function Checkbox(pos, text, checked, func) {
			Entity.call(this);
			this.position = pos;
			//this.width = 94;

			this.box_on = new ImageEntity(Zero(), 'img/switch_on.png');
			this.box_off = new ImageEntity(Zero(), 'img/switch_off.png');
			this.checked = false;
			if (checked) {
				this.checked = true;
			}
			this.action = func;

			this.add(this.box_on);
			//this.add ( new TextEntity(new V2(this.width, this.width/2), text, f.onscreen_left) );
		}

		Checkbox.prototype = new Entity();

		Checkbox.prototype.onClick = function () {
			if (this.checked) {
				this.checked = false;
				this.remove(this.box_on);
				this.add(this.box_off);
				//this.box.frame = 0;
			} else {
				this.checked = true;
				//this.box.frame = 1;
				this.remove(this.box_off);
				this.add(this.box_on);
			}
			if (this.action)
				this.action(this.checked);
				s.play('snd/click.mp3');
		};

		return Checkbox;
	}
);
