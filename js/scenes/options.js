define(['lib/scene', 'basic/button', 'basic/text', 'config/fonts', 'core/game', 'geo/v2', 'transitions/slideinright', 'transitions/slideinleft', 'basic/morph', 'definition/easing', 'basic/layout', 'entity/meter', 'entity/back', 'entity/checkbox', 'core/graphic'],
	function(Scene, Button, TextEntity, f, game, V2, SlideInRightTransition, SlideInLeftTransition, Morph, Easing, Layout, Meter, BackButton, Checkbox, g) {

		g.add('img/settings_bg.png');

		function OptionsScene() {
			Scene.call(this);

			this.bg = 'img/settings_bg.png';

			this.soundVolume = new Meter(new V2(195, 230), function (level) {
				game.sound_volume = level;
			});
			this.add(this.soundVolume);

			this.musicVolume = new Meter(new V2(195, 334), function(level) {
				document.getElementById('game_music').volume = level / 100;
				document.getElementById('menu_music').volume = level / 100;
			});
			this.add(this.musicVolume);


			this.textSpeed = new Meter(new V2(195, 446), function(level) {
				game.text_speed = level;
			}, [0, 50, 100], ['Easy', 'Medium', 'Hard'], 0);
			this.add(this.textSpeed);

			this.add(new Checkbox(new V2(850, 225), "+", true, function(checked) {
				game.operations[0] = checked;
			}));

			this.add(new Checkbox(new V2(1000, 225), "-", true, function(checked) {
				game.operations[1] = checked;
			}));

			this.add(new Checkbox(new V2(850, 280), "x", true, function(checked) {
				game.operations[2] = checked;
			}));

			this.add(new Checkbox(new V2(1000, 280), "/", true, function(checked) {
				game.operations[3] = checked;
			}));

			this.center(BackButton('menu', false, true));
		}

		OptionsScene.prototype = new Scene();

		return OptionsScene;
	}
);
