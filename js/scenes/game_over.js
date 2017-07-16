define(['basic/button', 'basic/text', 'lib/scene', 'geo/v2', 'core/graphic', 'core/sound', 'lib/animation', 'basic/image', 'config/scenes', 'core/game', 'scenes/play', 'config/fonts'],
    function(Button, TextEntity, Scene, V2, g, s, Animation, Image, Scenes, game, PlayScene, f) {
		s.add('snd/gameover.mp3');
		g.add('img/game_over_bg.png');
		g.add('img/button_back.png');
		g.add('img/button_back_hover.png');

        function GameOverScene() {
            Scene.call(this);

			this.bg = 'img/game_over_bg.png';

			this.center(Button.create(new V2(0, 500),
				function() {
					Scenes = require('config/scenes');
					Scenes.play = new PlayScene();
					document.getElementById('menu_music').play();

					require('core/game').scene = Scenes.menu;
				}
			).img('img/button_back.png').hoverImg('img/button_back_hover.png'));

            this.font = f.onscreen;

            this.diff = new TextEntity(new V2(810, 215), "", this.font);
            this.time = new TextEntity(new V2(810, 276), "", this.font);
            this.hits = new TextEntity(new V2(810, 337), "", this.font);
            this.miss = new TextEntity(new V2(810, 398), "", this.font);
            this.score = new TextEntity(new V2(810, 458), "", this.font);

            this.add(this.diff);
            this.add(this.score);
            this.add(this.time);
            this.add(this.hits);
            this.add(this.miss);
        }

        GameOverScene.prototype = new Scene();



		GameOverScene.prototype.gameOver = function (statistics) {
            var LEV = ["easy", "medium", "hard"];
            this.diff.text = LEV[statistics.level];
            this.score.text = statistics.score;
            this.time.text = Math.round(statistics.time / 1000) + "s";
            this.hits.text = (statistics.enemy_solved + statistics.boss_solved);
            this.miss.text = (statistics.enemy_lost + statistics.boss_lost);

			document.getElementById('game_music').pause();
			s.play('snd/gameover.mp3');
		};

        return GameOverScene;
    }
);
