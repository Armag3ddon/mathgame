define(['lib/scene', 'entity/back', 'core/graphic'],
		function(Scene, BackButton, g) {

            g.add('img/help_bg.jpg');

			function HelpScene() {
				Scene.call(this);
				this.center(BackButton('menu'));

                this.bg = 'img/help_bg.jpg';
			}

			HelpScene.prototype = new Scene();

			return HelpScene;
		}
);
