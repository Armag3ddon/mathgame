define(['lib/scene', 'geo/v2', 'entity/controller'],
		function(Scene, V2, Controller ) {
			function PlayScene() {
				Scene.call(this);

				this.controller = new Controller(Zero());
				this.add(this.controller);
			}

			PlayScene.prototype = new Scene();

			return PlayScene;
		}
);
