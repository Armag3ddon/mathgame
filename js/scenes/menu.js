define(['lib/scene', 'basic/button', 'core/game', 'geo/v2', 'transitions/slideinright', 'transitions/slideinleft', 'basic/morph', 'definition/easing', 'basic/layout', 'core/graphic'],
	function(Scene, Button, game, V2, SlideInRightTransition, SlideInLeftTransition, Morph, Easing, Layout, g) {

		g.add('img/menu_bg.png');
		g.add('img/button_start.png');
		g.add('img/button_options.png');
		g.add('img/button_help.png');
		g.add('img/button_credits.png');
        g.add('img/button_start_hover.png');
        g.add('img/button_options_hover.png');
        g.add('img/button_help_hover.png');
        g.add('img/button_credits_hover.png');

		function MenuScene() {
			Scene.call(this);

			this.playButton = Button.create(new V2(150, 380),
				function() {
					game.scene = require('config/scenes').play;
					document.getElementById('menu_music').pause();
					document.getElementById('game_music').play();
				}
			).img('img/button_start.png').hoverImg('img/button_start_hover.png');

            this.optionsButton = Button.create(new V2(650, 380),
				function() {
					game.scene = require('config/scenes').options;
				}
			).img('img/button_options.png').hoverImg('img/button_options_hover.png');

            this.creditsButton = Button.create(new V2(150, 530),
				function() {
					game.scene = new SlideInLeftTransition(require('config/scenes').credits, 1000, Easing.OUTQUAD);
				}
			).img('img/button_credits.png').hoverImg('img/button_credits_hover.png');

            this.helpButton = Button.create(new V2(650, 530),
				function() {
					game.scene = new SlideInRightTransition(require('config/scenes').help, 1000, Easing.OUTQUAD);
				}
			).img('img/button_help.png').hoverImg('img/button_help_hover.png');

            this.bg = 'img/menu_bg.png';
            this.add(this.playButton);
            this.add(this.optionsButton);
            this.add(this.creditsButton);
            this.add(this.helpButton);
		}

		MenuScene.prototype = new Scene();

		MenuScene.prototype.loaded = function () {
			document.getElementById('menu_music').play();
		};

		return MenuScene;
	}
);
