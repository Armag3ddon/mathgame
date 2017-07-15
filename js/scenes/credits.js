define(['lib/scene', 'entity/back', 'basic/text', 'geo/v2', 'core/graphic'],
		function(Scene, BackButton, TextEntity, V2, g) {

			g.add('img/menu_bg.png');

			function CreditsScene() {
				Scene.call(this);

				this.bg = 'img/menu_bg.png';

				this.center(new TextEntity(new V2(0, 100), "Max Mustermann"));
				this.center(new TextEntity(new V2(0, 200), "Erica Mustemann"));
				this.center(new TextEntity(new V2(0, 300), "Gunda Gamedesigner"));
				this.center(new TextEntity(new V2(0, 400), "Peter Programmierer"));
				this.center(BackButton('menu', true));
			}

			CreditsScene.prototype = new Scene();

			return CreditsScene;
		}
);
