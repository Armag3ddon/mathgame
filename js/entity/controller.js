define(['basic/entity', 'geo/v2', 'entity/enemy', 'definition/random'],
	function(Entity, V2, Enemy, Random)
	{
		var OPERATORS = ['+', '-'];

		function Controller(pos) {
			Entity.call(this);
			this.position = pos;

			this.game_settings = {
				spawn_delay : 2000
			};

			this._delay_counter = this.game_settings.spawn_delay;

			this.rand10 = Random.between(1, 10);
			this.rand100 = Random.between(10, 100);
		}

		Controller.prototype = new Entity();

		Controller.prototype.onUpdate = function (delta) {

			if (this._delay_counter <= 0) {
				var enemy_options = {
					speed : this.rand100(), // Todo good speeds
					op_1 : this.rand10(),
					op_2 : this.rand10(),
					operator : OPERATORS[parseInt(Random.between(0, OPERATORS.length - 1)(), 10)]
				};

				this.add(new Enemy(Zero(), enemy_options));
				this._delay_counter = this.game_settings.spawn_delay;
			}

			this._delay_counter -= delta;
		};

		return Controller;
	}
);
