define(['basic/entity', 'config/fonts'],
		function(Entity, fonts) {
			function TextEntity(pos, text, font) {
				Entity.call(this, pos);
				this.text = text;
				this.font = font || fonts.default;
			}

			TextEntity.prototype = new Entity();

			TextEntity.prototype.onDraw = function(ctx) {
				this.font.apply(ctx, this.hover());
				if (this.effectFrame) {
					ctx.fillStyle = '#33cc33';
					var length = ctx.measureText(this.text).width + 4;
					ctx.fillRect(-2, -29/2, length, 29);
				}
				if (this.override_color)
					ctx.fillStyle = this.override_color;
				ctx.fillText(this.text, 0, 0);
			};

			return TextEntity;
		}
);
