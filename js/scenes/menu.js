define(['lib/scene', 'basic/button', 'core/game', 'geo/v2', 'transitions/slideinright', 'transitions/slideinleft', 'basic/morph', 'definition/easing', 'basic/layout'],
	function(Scene, Button, game, V2, SlideInRightTransition, SlideInLeftTransition, Morph, Easing, Layout) {
		function MenuScene() {
			Scene.call(this);

			var playButton = Button.create(new V2(0, 680),
				function() {
					game.scene = require('config/scenes').play;
					document.getElementById('menu_music').pause();
					document.getElementById('game_music').play();
				}
			).rect(280, 60).text("Play");

			var optionsButton = Button.create(new V2(0, 680),
				function() {
					game.scene = require('config/scenes').options;
				}
			).rect(280, 60).text("Options");

			var creditsButton = Button.create(new V2(0, 680),
				function() {
					game.scene = new SlideInLeftTransition(require('config/scenes').credits, 1000, Easing.OUTQUAD);
				}
			).rect(280, 60).text("Credits");

			var helpButton = Button.create(new V2(0, 680),
				function() {
					game.scene = new SlideInRightTransition(require('config/scenes').help, 1000, Easing.OUTQUAD);
				}
			).rect(280, 60).text("Help");

			var vLayout = new Layout.vertical(new V2(0, 350), 20, 20);
			vLayout.add(playButton);
			vLayout.add(optionsButton);
			vLayout.add(creditsButton);
			vLayout.add(helpButton);
			vLayout.align("center");
			this.center(vLayout);
		}

		MenuScene.prototype = new Scene();

		MenuScene.prototype.loaded = function () {
			document.getElementById('menu_music').play();
		}

		return MenuScene;
	}
);
