define(['lib/scene', 'entity/back', 'basic/text', 'geo/v2', 'core/graphic'],
		function(Scene, BackButton, TextEntity, V2, g) {

			g.add('img/credits_bg.png');

			function CreditsScene() {
				Scene.call(this);

				this.bg = 'img/credits_bg.png';

				this.center(new TextEntity(new V2(0, 100), "Judith Gastell"));
				this.center(new TextEntity(new V2(0, 200), "Tamara Meyendriesch"));
				this.center(new TextEntity(new V2(0, 300), "Andrea Kupsch"));
				this.center(new TextEntity(new V2(0, 400), "Michael Lennartz"));
				this.center(new TextEntity(new V2(0, 500), "Felix Wagner"));
				this.center(BackButton('menu', true));
			}

			CreditsScene.prototype = new Scene();

			return CreditsScene;
		}
);
