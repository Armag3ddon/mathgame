define(['lib/scene', 'basic/button', 'basic/text', 'config/fonts', 'core/game', 'geo/v2', 'transitions/slideinright', 'transitions/slideinleft', 'basic/morph', 'definition/easing', 'basic/layout', 'entity/meter', 'entity/back', 'entity/checkbox'],
	function(Scene, Button, TextEntity, f, game, V2, SlideInRightTransition, SlideInLeftTransition, Morph, Easing, Layout, Meter, BackButton, Checkbox) {
		function OptionsScene() {
			Scene.call(this);

			var y = 75;
			var x = 50;

			this.soundVolume = new Meter(new V2(x, y), function (level) {
				game.sound_volume = level;
			});
			this.add(this.soundVolume);
			y -= 5;
			this.add(new TextEntity(new V2(x, y), "Sound volume:", f.onscreen_left));
			y += 110;

			this.musicVolume = new Meter(new V2(x, y), function(level) {
				document.getElementById('game_music').volume = level / 100;
				document.getElementById('menu_music').volume = level / 100;
			});
			this.add(this.musicVolume);
			y -= 5;
			this.add(new TextEntity(new V2(x, y), "Music volume:", f.onscreen_left));
			y += 110;

			y += 50;

			this.textSpeed = new Meter(new V2(x, y), function(level) {
				game.text_speed = level;
			}, [0, 50, 100], ['Slow', 'Medium', 'Fast'], 0);
			this.add(this.textSpeed);
			y -= 5;
			this.add(new TextEntity(new V2(x, y), "Text speed:", f.onscreen_left));

			y = 75;
			x += 700;

			this.add(new TextEntity(new V2(x, y), "Allowed operations:", f.onscreen_left));
			y += 30;

			this.add(new Checkbox(new V2(x, y), "+", true, function(checked) {
				game.operations[0] = checked;
			}));
			x += 150;

			this.add(new Checkbox(new V2(x, y), "-", true, function(checked) {
				game.operations[1] = checked;
			}));
			x -= 150;
			y += 110;

			this.add(new Checkbox(new V2(x, y), "x", true, function(checked) {
				game.operations[2] = checked;
			}));
			x += 150;

			this.add(new Checkbox(new V2(x, y), "/", true, function(checked) {
				game.operations[3] = checked;
			}));
			x -= 150;
			y += 100;

			this.center(BackButton('menu', false, true));
		}

		OptionsScene.prototype = new Scene();

		return OptionsScene;
	}
);
