define(['basic/entity', 'geo/v2', 'geo/rect', 'entity/enemy', 'definition/random'],
	function(Entity, V2, Rect, Enemy, R)
	{
		var between = R.betweenInt;
		var OPERATORS = ['+', '-', '*', '/'];

		var OP_GENERATORS = {
			'+' : function() {
				return {
					op_1 : between(1, 10),
					op_2 : between(1, 10)
				};
			},
			'-': function() {
				var op1 = between(1, 10),
					op2 = between(1, 10);

				return {
					op_1 : op1 > op2 ? op1 : op2,
					op_2 : op1 > op2 ? op2 : op1
				};
			},
			'*': function() {
				return {
					op_1 : between(1, 10),
					op_2 : between(1, 10)
				};
			},
			'/': function() {
				var op1 = between(1, 10),
					op2 = between(1, 10);

				return {
					op_1 : op1 * op2,
					op_2 : op2
				};
			}
		};

		function Controller(pos) {
			Entity.call(this);
			this.position = pos;

			// the screen is x0,y0 295/18 and x1,y1 983/407
			// - some space for the input field and bar
			this.screen_bounds = Rect.create(295, 18, 983, 380);

			this.game_settings = {
				// spawn am enemy every ms
				enemy_delay : 2000,
				// spawn a boss every ms
				boss_delay: 20000,
				// speed
				enemy_speed : function() {
					return between(5, 20);
				}.bind(this),
				// height
				hit_line_pos : function() {
					return this.screen_bounds.p2.y;
				}.bind(this),
				// nr of operations allowed
				nr_of_operations : function() {
					return OPERATORS.length;
				}.bind(this)
			};

			this.statistics = {
				score : 0,
				solved : 0,
				lost : 0,
				time : 0
			};

			this._delay_counter = 0;
		}

		Controller.prototype = new Entity();

		Controller.prototype.onUpdate = function (delta) {

			var enemy_speed_x = 0;
			var enemy_speed_y = this.game_settings.enemy_speed();

			if (this._delay_counter <= 0) {
				var enemy_options = {
					speed : new V2(enemy_speed_x, enemy_speed_y),
					operator : OPERATORS[between(0, this.game_settings.nr_of_operations())]
				};

				var op_values = this.getValues(enemy_options.operator);
				enemy_options.op_1 = op_values.op_1;
				enemy_options.op_2 = op_values.op_2;

				var initial_position = this.getStartPosition();

				this.add(new Enemy(initial_position, Zero(), undefined, enemy_options));
				this._delay_counter = this.game_settings.enemy_delay;
			}

			this._delay_counter -= delta;
			this.statistics.time += delta;
		};

		// Called when an enemy reaches the bottom line, player should be
		Controller.prototype.onEnemyReachedBottom = function(entity) {
			console.log("You got hit by: a smooth criminal");
			this.statistics.lost += 1;
			this.parent.triggerRandomEvent();
			console.log(this.statistics);
		};

		// Check if an entity is still on a valid screen position, otherwise remove
		Controller.prototype.checkEntityForBounds = function(entity, position) {
			if (position.y > this.game_settings.hit_line_pos) {
				this.onEnemyReachedBottom(entity);
				this.remove(entity);
			}
		};

		// filters the entities
		Controller.prototype.processInput = function(input) {
			this.entities = this.entities.filter(function(e) {
				if (e.isHitBy(input)) {
					this.statistics.score += e.result;
					this.statistics.solved += 1;
					console.log('Got One with:', input);
					console.log(this.statistics);
					return false;
				}
				return true;
			}.bind(this));
		};

		// get the start position for an enitiy randomly inside the screen rect on top
		Controller.prototype.getStartPosition = function() {
			var x_offset_to_composate_width = 50;
			return new V2(between(this.screen_bounds.p1.x, this.screen_bounds.p2.x - x_offset_to_composate_width),
				this.screen_bounds.p1.y);
		};

		Controller.prototype.getValues = function(operator) {
			return OP_GENERATORS[operator]();
		};

		return Controller;
	}
);
