define(['basic/entity', 'geo/v2', 'geo/rect', 'entity/enemy', 'definition/random'],
	function(Entity, V2, Rect, Enemy, Random)
	{
		var OPERATORS = ['+', '-', '*', '/'];



		var betweenInt = function(min, max) {
			return parseInt(Math.random() * (max-min) + min, 10);
		};

		function Controller(pos) {
			Entity.call(this);
			this.position = pos;

			this.game_settings = {
				spawn_delay : 2000
			};

			this.statistics = {
				score : 0,
				solved : 0,
				lost : 0,
				time : 0
			};

			// the screen is x0,y0 295/18 and x1,y1 983/407
			// - some space for the input field and bar
			this.screen_bounds = Rect.create(295, 18, 983, 380);

			this._delay_counter = 0;
		}

		Controller.prototype = new Entity();

		Controller.prototype.onUpdate = function (delta) {

			var enemy_speed_x = 0;
			var enemy_speed_y = betweenInt(5, 20); // todo multiply with game phase speed

			if (this._delay_counter <= 0) {
				var enemy_options = {
					speed : new V2(enemy_speed_x, enemy_speed_y),
					operator : OPERATORS[betweenInt(0, OPERATORS.length)]
				};

				var op_values = this.getValues(enemy_options.operator);
				enemy_options.op_1 = op_values.op_1;
				enemy_options.op_2 = op_values.op_2;

				var initial_position = this.getStartPosition();

				this.add(new Enemy(initial_position, Zero(), undefined, enemy_options));
				this._delay_counter = this.game_settings.spawn_delay;
			}

			this._delay_counter -= delta;
			this.statistics.time += delta;
		};

		// Called when an enemy reaches the bottom line, player should be
		Controller.prototype.onEnemyReachedBottom = function(entity) {
			console.log("You got hit by: a smooth criminal");
			this.statistics.lost += 1;
			console.log(this.statistics);
		};

		// Check if an entity is still on a valid screen position, otherwise remove
		Controller.prototype.checkEntityForBounds = function(entity, position) {
			if (position.y > this.screen_bounds.p2.y) {
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
			return new V2(betweenInt(this.screen_bounds.p1.x, this.screen_bounds.p2.x - x_offset_to_composate_width),
				this.screen_bounds.p1.y);
		};

		Controller.prototype.getValues = function(operator) {
			switch (operator) {
				case '+':
					return this.getValuesForAddition();
				case '-':
					return this.getValuesForSubtraction();
				case '*':
					return this.getValuesForMultiplication();
				case '/':
					return this.getValuesForDivision();
			}
		};

		Controller.prototype.getValuesForAddition = function() {
			return {
				op_1 : betweenInt(1, 10),
				op_2 : betweenInt(1, 10)
			};
		};

		Controller.prototype.getValuesForSubtraction = function() {
			var op1 = betweenInt(1, 10),
				op2 = betweenInt(1, 10);

			return {
				op_1 : op1 > op2 ? op1 : op2,
				op_2 : op1 > op2 ? op2 : op1
			};
		};

		Controller.prototype.getValuesForMultiplication = function() {
			return this.getValuesForAddition();
		};

		// make division always be without fractions
		Controller.prototype.getValuesForDivision = function() {
			var op1 = betweenInt(1, 10),
				op2 = betweenInt(1, 10);

			return {
				op_1 : op1 * op2,
				op_2 : op2
			};
		};



		return Controller;
	}
);
