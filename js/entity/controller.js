define(['basic/entity', 'geo/v2', 'geo/rect', 'entity/enemy', 'definition/random'],
	function(Entity, V2, Rect, Enemy, Random)
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

			// the screen is x0,y0 295/18 and x1,y1 983/407
			// - some space for the input field and bar
			this.screen_bounds = Rect.create(295, 18, 983, 380);

			this._delay_counter = 0;
		}

		Controller.prototype = new Entity();

		Controller.prototype.onUpdate = function (delta) {

			var enemy_speed_x = 0; // betweenInt(-10, 10)
			var enemy_speed_y = betweenInt(5, 20); // todo multiply with game phase speed

			if (this._delay_counter <= 0) {
				var enemy_options = {
					speed : new V2(enemy_speed_x, enemy_speed_y),
					op_1 : betweenInt(1, 10),
					op_2 : betweenInt(1, 10),
					operator : OPERATORS[betweenInt(0, OPERATORS.length - 1)]
				};

				var initial_position = new V2(betweenInt(295, 983), 18);
				var size = new V2(30, 30);

				this.add(new Enemy(initial_position, size, undefined, enemy_options));
				this._delay_counter = this.game_settings.spawn_delay;
			}

			this._delay_counter -= delta;
		};

		// Check if an entity is still on a valid screen position, otherwise remove
		Controller.prototype.checkEntityForBounds = function(entity, position) {
			if (position.y > this.screen_bounds.p2.y) {
				this.remove(entity);
			}
		}

		return Controller;
	}
);
