define(['basic/entity', 'config/fonts'],
		function(Entity, fonts) {
			function TextEntity(pos, text, font) {
				Entity.call(this, pos);
				this.text = text;
				this.font = font || fonts.default;
				this.frameColor = '#33cc33';
			}

			TextEntity.prototype = new Entity();

			TextEntity.prototype.onDraw = function(ctx) {
				this.font.apply(ctx, this.hover());
				if (this.effectFrame) {
					ctx.fillStyle = this.frameColor;
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
