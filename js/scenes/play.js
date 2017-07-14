define(['lib/scene', 'geo/v2', 'core/graphic', 'entity/controller', 'entity/typefield'],
		function(Scene, V2, g, Controller, TypeField ) {
			g.add('img/background.jpg');

			function PlayScene() {
				Scene.call(this);

				this.controller = new Controller(Zero());
				this.add(this.controller);

				this.typefield = new TypeField(new V2(310, 380));
				this.add(this.typefield);
				this.keyAware.push(this.typefield);

				this.bg = 'img/background.jpg';
			}

			PlayScene.prototype = new Scene();

			return PlayScene;
		}
);
