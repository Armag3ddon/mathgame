define(['basic/entity', 'geo/v2', 'entity/enemy', 'definition/random'],
	function(Entity, V2, Enemy, Random)
	{
		var OPERATORS = ['+', '-'];

		var betweenInt = function(min, max) {
			return parseInt(Math.random() * (max-min) + min, 10);
		};

		function Controller(pos) {
			Entity.call(this);
			this.position = pos;

			this.game_settings = {
				spawn_delay : 2000
			};

			this._delay_counter = 0;
		}

		Controller.prototype = new Entity();

		Controller.prototype.onUpdate = function (delta) {

			if (this._delay_counter <= 0) {
				var enemy_options = {
					speed : new V2(betweenInt(-20, 20), betweenInt(5, 20)),
					op_1 : betweenInt(1, 10),
					op_2 : betweenInt(1, 10),
					operator : OPERATORS[betweenInt(0, OPERATORS.length - 1)]
				};

				var initial_position = new V2(betweenInt(100, 900), betweenInt(100, 600));
				var size = new V2(30, 30);

				this.add(new Enemy(initial_position, size, undefined, enemy_options));
				this._delay_counter = this.game_settings.spawn_delay;
			}

			this._delay_counter -= delta;
		};

		return Controller;
	}
);
