define(['scenes/menu', 'scenes/credits', 'scenes/play', 'scenes/help', 'scenes/options'],
		function (MenuScene, CreditsScene, PlayScene, HelpScene, OptionsScene) {
			return {
				init: function () {
					this.menu = new MenuScene();
					this.credits = new CreditsScene();
					this.play = new PlayScene();
					this.help = new HelpScene();
					this.options = new OptionsScene();
					this.default = this.menu;
				}
			};
		}
);
