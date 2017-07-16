define(['lib/scene', 'entity/back', 'core/graphic'],
		function(Scene, BackButton, g) {

            g.add('img/menu_bg.png');

			function HelpScene() {
				Scene.call(this);
				this.center(BackButton('menu'));

                this.bg = 'img/menu_bg.png';
			}

			HelpScene.prototype = new Scene();

			return HelpScene;
		}
);
