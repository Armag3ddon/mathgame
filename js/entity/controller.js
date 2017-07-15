define(['basic/entity', 'geo/v2', 'geo/rect', 'entity/enemy', 'entity/boss', 'definition/random', 'core/game'],
	function(Entity, V2, Rect, Enemy, Boss, R, game)
	{
		var between = R.betweenInt;
		var ALL_OPERATORS = ['+', '-', '*', '/'],
			OPERATORS = ALL_OPERATORS;

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

		var getRandomOp = function(max_ops) {
			var operator =  OPERATORS[between(0, max_ops)],
				op_values = OP_GENERATORS[operator]();

			return {
				operator : operator,
				op_1 : op_values.op_1,
				op_2 : op_values.op_2
			};
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
				// nr od operations for a boss
				boss_ops : 2,
				// speed (x and y direction)
				enemy_speed : function() {
					return new V2(0, between(20, 40) * this.game_settings.diff_base());
				}.bind(this),
				// boss speed is different (x and y direction)
				boss_speed : function() {
					return new V2(0, between(10, 20) * this.game_settings.diff_base());
				}.bind(this),

				// height
				hit_line_pos : function() {
					return this.screen_bounds.p2.y;
				}.bind(this),

				// nr of operations allowed
				nr_of_operations : function() {
					return OPERATORS.length;
				}.bind(this),

				// difficulty base value from settings
				diff_base : function() {
					return Math.max(0.1, game.text_speed / 2);
				}
			};

			this.statistics = {
				score : 0,
				enemy_solved : 0,
				enemy_lost : 0,
				time : 0,
				boss_solved: 0,
				boss_lost : 0
			};

			this._enemy_delay = 0;
			this._boss_delay = this.game_settings.boss_delay;
			this._boss_active = false;
		}

		Controller.prototype = new Entity();

		Controller.prototype.onUpdate = function (delta) {
			OPERATORS = ALL_OPERATORS.filter(function(o, i) {
				return game.operations[i];
			});

			if (this._enemy_delay <= 0 && !this._boss_active) {
				this.spawnEnemy();
				this._enemy_delay = this.game_settings.enemy_delay;
			}

			if (this._boss_delay <= 0 && !this._boss_active) {
				this.spawnBoss();
				this._boss_delay = this.game_settings.boss_delay;
				this._boss_active = true;
			}

			// having an active boss doesn't trigger new objects
			if (!this._boss_active) {
				this._boss_delay -= delta;
				this._enemy_delay -= delta;
			}

			this.statistics.time += delta;
		};

		Controller.prototype.spawnEnemy = function() {
			var op = getRandomOp(this.game_settings.nr_of_operations());

			this.add(new Enemy(this.getStartPosition(), {
				speed : this.game_settings.enemy_speed(),
				operator : op.operator,
				op_1 : op.op_1,
				op_2 : op.op_2
			}));
		};

		Controller.prototype.spawnBoss = function() {
			var ops = [];
			for (var i=0; i < this.game_settings.boss_ops; i++) {
				ops.push(getRandomOp(this.game_settings.nr_of_operations()));
			}

			// center bosses
			var start_pos = new V2(this.screen_bounds.p1.x + 250, this.screen_bounds.p1.y);

			this.add(new Boss(start_pos, {
				speed : this.game_settings.boss_speed(),
				operations : ops
			}));
		};

		// Called when an enemy reaches the bottom line, player should be
		Controller.prototype.onEnemyReachedBottom = function(entity) {
			if (entity.isBoss()) {
				console.log("You got hit by: a boss!");
				this._boss_active = false;
				this._boss_delay = this.game_settings.boss_delay;
				this.statistics.boss_lost += 1;
			} else {
				console.log("You got hit by: a dude");
				this.statistics.enemy_lost += 1;
			}

			this.parent.triggerRandomEvent();

			console.log(this.statistics);
		};

		// Check if an entity is still on a valid screen position, otherwise remove
		Controller.prototype.checkEntityForBounds = function(entity, position) {
			if (position.y > this.game_settings.hit_line_pos()) {
				this.onEnemyReachedBottom(entity);
				this.remove(entity);
			}
		};

		// filters the entities
		Controller.prototype.processInput = function(input) {
			this.entities = this.entities.filter(function(e) {
				if (e.isHitBy(input)) {
					this.statistics.score += e.result;

					if (e.isBoss()) {
						this.statistics.boss_solved += 1;
						console.log('Boss kill!');
						this._boss_active = false;
						this._boss_delay = this.game_settings.boss_delay;
					} else {
						this.statistics.enemy_solved += 1;
					}

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

		return Controller;
	}
);
