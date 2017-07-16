define(['lib/transition'],
		function(TransitionScene) {

			function SlideInDownTransition(toScene, duration, easing) {
				TransitionScene.call(this, toScene, duration, easing);
			}

			SlideInDownTransition.prototype = new TransitionScene();
			SlideInDownTransition.prototype.constructor = SlideInDownTransition;

			SlideInDownTransition.prototype.performTransition = function(ctx) {
				var offset = -this.progress * this.size.y;
				ctx.drawImage(this.fromBuffer.buffer, 0, offset);
				ctx.drawImage(this.toBuffer.buffer, 0, this.size.y + offset);
			}

			return SlideInDownTransition;

		}
);
