define(['lib/transition'],
		function(TransitionScene) {

			function SlideInUpTransition(toScene, duration, easing) {
				TransitionScene.call(this, toScene, duration, easing);
			}

			SlideInUpTransition.prototype = new TransitionScene();
			SlideInUpTransition.prototype.constructor = SlideInUpTransition;

			SlideInUpTransition.prototype.performTransition = function(ctx) {
				var offset = this.progress * this.size.y;
				ctx.drawImage(this.fromBuffer.buffer, 0, offset);
				ctx.drawImage(this.toBuffer.buffer, 0, -this.size.y + offset);
			}

			return SlideInUpTransition;

		}
);
