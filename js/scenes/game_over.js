define(['basic/button', 'lib/scene', 'geo/v2', 'core/graphic', 'core/sound', 'lib/animation', 'basic/image', 'config/scenes', 'core/game', 'scenes/play'],
    function(Button, Scene, V2, g, s, Animation, Image, Scenes, game, PlayScene) {
		s.add('snd/gameover.mp3');
		g.add('img/menu_bg.png');
		g.add('img/button_back.png');

        function GameOverScene() {
            Scene.call(this);

			this.bg = 'img/menu_bg.png';

			this.center(Button.create(new V2(0, 480),
				function() {
					Scenes = require('config/scenes');
					Scenes.play = new PlayScene();
					document.getElementById('menu_music').play();

					require('core/game').scene = Scenes.menu;
				}
			).img('img/button_back.png'));

        }

        GameOverScene.prototype = new Scene();

		GameOverScene.prototype.gameOver = function () {
			document.getElementById('game_music').pause();
			s.play('snd/gameover.mp3');
		}

        return GameOverScene;
    }
);
