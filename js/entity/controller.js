define(['basic/entity', 'geo/v2', 'geo/rect', 'entity/enemy', 'entity/boss', 'definition/random', 'core/game', 'config/fonts', 'core/sound', 'entity/left_monitor', 'entity/right_monitor'],
	function(Entity, V2, Rect, Enemy, Boss, R, game, f, s, LeftMonitor, RightMonitor)
	{
		s.add('snd/correct_answer.mp3');
		s.add('snd/wrong_answer.mp3');
		s.add('snd/fail.mp3');
		s.add('snd/combo.mp3');

		var between = R.betweenInt;
		var ALL_OPERATORS = ['+', '-', '*', '/'];
		var OPERATORS = ALL_OPERATORS;

		var VALID_COMBO_MODIFIERS = ['+', '-', '*'];

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
				enemy_delay : function() {
					// with easy, this goes down from about 4 seconds initially
					return Math.max(500, 3000 + (1/this.getDifficultyFactor() * 100));
				}.bind(this),
				// spawn a boss every ms
				boss_delay: function() {
					return 20000;
				}.bind(this),
				// nr od operations for a boss
				boss_ops : 2,
				// speed (x and y direction)
				enemy_speed : function() {
					return new V2(0, between(20, 20) * this.getDifficultyFactor());
				}.bind(this),
				// boss speed is different (x and y direction)
				boss_speed : function() {
					return new V2(0, between(5, 20) * this.getDifficultyFactor());
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
				},

				// all x seconds we make it harder
				diff_change_time : 10000,

				// shield_down_delay
				shield_down_delay : 1000,

				// hits per time unit
				shield_down_damage_percent : function() {
					return Math.max(1.5, 3 * this.getDifficultyFactor());
				}.bind(this),

				// enemy make extra damage
				enemy_shield_down_damage : 2,

				// enemys fill up the shields by this amount
				enemy_shield_health : 4,

				// bosses makes even more damage
				boss_shield_down_damage : 7,

				// but they also heal the shield much
				boss_shield_health : 20
			};

			this.statistics = {
				level : game.text_speed,
				score : 0,
				enemy_solved : 1,
				enemy_lost : 0,
				time : 0,
				boss_solved: 0,
				boss_lost : 0
			};

			this._enemy_delay = 0;
			this._boss_delay = this.game_settings.boss_delay;
			this._boss_active = false;

			this.dieing = [];
			this.hit_buffer = 0;
			this.music_timeout = 0;

			this._diff_change = this.game_settings.diff_change_time;
			this._current_diff = 0;

			this.add(new LeftMonitor(new V2(515, 478), {}));
			this.add(new RightMonitor(new V2(660, 478), {
				size : new V2(200, 50)
			}));

			this.current_combo_modifier = '+';

			this.total_health_percent = 100;
			this._shield_down_delay = this.game_settings.shield_down_delay;

		}

		Controller.prototype = new Entity();

		Controller.prototype.onUpdate = function (delta) {
			OPERATORS = ALL_OPERATORS.filter(function(o, i) {
				return game.operations[i];
			});

			if (this.music_timeout > 0) {
				this.music_timeout -= delta;
				if (this.music_timeout <= 0) {
					this.music_timeout = 0;
					document.getElementById('game_music').play();
				}
			}

			if (this._enemy_delay <= 0 && !this._boss_active) {
				this.spawnEnemy();
				this._enemy_delay = this.game_settings.enemy_delay();
			}

			if (this._boss_delay <= 0 && !this._boss_active) {
				this.spawnBoss();
				this._boss_delay = this.game_settings.boss_delay();
				this._boss_active = true;
			}

			if (this._diff_change < 0) {
				this.increaseDifficulty();
				this._diff_change = this.game_settings.diff_change_time;
			}

			// having an active boss doesn't trigger new objects
			if (!this._boss_active) {
				this._boss_delay -= delta;
				this._enemy_delay -= delta;
			}

			if (this._shield_down_delay <= 0) {
				this.total_health_percent -= this.game_settings.shield_down_damage_percent();
				this._shield_down_delay = this.game_settings.shield_down_delay;
				console.log("Sir, shields down to " + this.total_health_percent + " Percent !");
				if (this.total_health_percent < 0) {
					this.gameOver();
				}
			}

			this.total_health_percent = Math.max(Math.min(this.total_health_percent, 100), 0);

			this.statistics.time += delta;
			this._diff_change -= delta;
			this._shield_down_delay -= delta;

			this.dispatch(this.dieing, 'update', delta);
			if (this.hit_buffer > 0) {
				if (this.hit_buffer == 1)
					s.play('snd/correct_answer.mp3');
					if (Math.random()*100 < 4)
						this.parent.success();
				if (this.hit_buffer > 1) {
					s.play('snd/correct_answer.mp3');
					this.parent.success();
				}
				this.hit_buffer = 0;
			}
		};

		Controller.prototype.onDraw = function(ctx) {
			this.dispatch(this.dieing, 'draw', ctx);
		};

		Controller.prototype.getDifficultyFactor = function() {
			return this.game_settings.diff_base() + this._current_diff;
		};

		Controller.prototype.increaseDifficulty = function() {
			console.log("Difficulty increased, total", this.getDifficultyFactor() + 0.1);
			return this._current_diff += 0.1;
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

			this.add(new Boss(this.getStartPosition(true), {
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
				this.total_health_percent -= this.game_settings.boss_shield_down_damage;
				this.statistics.boss_lost += 1;
				this.parent.fail();
			} else {
				console.log("You got hit by: a girl or boy or other dude");
				this.statistics.enemy_lost += 1;
				this.total_health_percent -= this.game_settings.enemy_shield_down_damage;
				if (Math.random()*100 < 4)
					this.parent.fail();
				s.play('snd/fail.mp3');
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
			if (this.checkForCombo(input)) {
				this.showComboWonAnimation();
			}

			this.entities = this.entities.filter(function(e) {
				if (typeof e.isHitBy !== 'undefined' && e.isHitBy(input)) {
					this.statistics.score += e.result;

					if (e.isBoss()) {
						this.statistics.boss_solved += 1;
						console.log('Boss kill!');
						this._boss_active = false;
						this._boss_delay = this.game_settings.boss_delay;
						this.total_health_percent += this.game_settings.boss_shield_health;
					} else {
						this.total_health_percent += this.game_settings.enemy_shield_health;
						this.statistics.enemy_solved += 1;
					}

					console.log('Got One with:', input);
					console.log(this.statistics);
					return false;
				}
				return true;
			}.bind(this));

			if (this.hit_buffer == 0)
				s.play('snd/wrong_answer.mp3');
		};

		// get the start position for an enitiy randomly inside the screen rect on top
		Controller.prototype.getStartPosition = function(narrow) {
			var x_offset_to_composate_width = 50;
			if (narrow)
				return new V2(between(this.screen_bounds.p1.x + x_offset_to_composate_width, this.screen_bounds.p2.x - x_offset_to_composate_width*2),
					this.screen_bounds.p1.y + f.onscreen.size/2);
			return new V2(between(this.screen_bounds.p1.x, this.screen_bounds.p2.x - x_offset_to_composate_width),
				this.screen_bounds.p1.y + f.onscreen.size/2);
		};

		Controller.prototype.addToDieing = function (enemy) {
			if (enemy.isBoss())
				this._boss_active = false;
			this.dieing.push (enemy);
			this.hit_buffer++;
		};

		Controller.prototype.removeFromDieing = function (enemy) {
			var index = this.dieing.indexOf(enemy);
			if (index > -1)
				this.dieing.splice(index, 1);
		};

		// returns a random number or a real result from on screen enemies
		Controller.prototype.getNumberForMonitor = function() {
			var w20 = between(1, 20),
				enemies_on_screen = this.entities.filter(function(e) {
					return typeof e.isBoss === 'function';
				});

			if (w20 < 15 || enemies_on_screen.length === 0) {
				return {
					real: false,
					val : between(1, 75)
				};
			}

			var r = between(0, enemies_on_screen.length);

			return {
				real : true,
				val : enemies_on_screen[r].result
			};
		};

		Controller.prototype.getNewComboModifier = function() {
			var r = between(0, VALID_COMBO_MODIFIERS.length);

			this.current_combo_modifier = VALID_COMBO_MODIFIERS[r];
			return this.current_combo_modifier;
		};

		Controller.prototype.checkForCombo = function(input) {
			var dead = [],
				found = false;

			// check if any of the enemies + combo modif + another enemy matches the input
			for (var j=0; j<this.entities.length; j++) {
				var e1 = this.entities[j];
				if (typeof e1.result === 'undefined')
					continue;

				for (var i=0; i<this.entities.length; i++) {
					var e2 = this.entities[i];
					if (typeof e2.result === 'undefined')
						continue;

					var result = parseInt(eval(e1.result + this.current_combo_modifier + e2.result), 10);
					if (result == input) {
						dead.push(e1);
						dead.push(e2);
						found = true;
						break;
					}
				}

				if (found)
					break;
			}

			if (found) {
				dead.forEach(function(e) {
					e.death();
				}.bind(this));
			}

			return found;
		};

		Controller.prototype.showComboWonAnimation = function() {
			s.play('snd/combo.mp3');
			this.music_timeout = 4180;
			document.getElementById('game_music').pause();
		};

		Controller.prototype.gameOver = function() {
			game.scene = require('config/scenes').gameover;
			game.scene.gameOver(this.statistics);
		};



		return Controller;
	}
);
