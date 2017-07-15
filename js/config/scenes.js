define(['scenes/menu', 'scenes/credits', 'scenes/play', 'scenes/help', 'scenes/options', 'scenes/game_over'],
		function (MenuScene, CreditsScene, PlayScene, HelpScene, OptionsScene, GameOverScene) {
			return {
				init: function () {
					this.menu = new MenuScene();
					this.credits = new CreditsScene();
					this.play = new PlayScene();
					this.help = new HelpScene();
					this.options = new OptionsScene();
					this.gameover = new GameOverScene();
					this.default = this.menu;
				}
			};
		}
);
