define(['require', 'basic/button', 'core/graphic', 'core/game', 'geo/v2', 'transitions/slideinleft', 'transitions/slideinright', 'transitions/slideindown', 'transitions/slideinup', 'definition/easing'],
	function(require, Button, graphics, game, V2, SlideInLeftTransition, SlideInRightTransition, SlideInDownTransition, SlideInUpTransition, Easing) {
		graphics.add('img/button_back.png');
		graphics.add('img/button_back_hover.png');

		function BackButton(scene, right, no_transition, y_transition) {
			if (no_transition)
				return Button.create(new V2(0, 600), function() { game.scene = require('config/scenes')[scene]; }).img('img/button_back.png').hoverImg('img/button_back_hover.png');
			if (y_transition) {
				if (right)
					return Button.create(new V2(0, 600), function() { game.scene = new SlideInUpTransition(require('config/scenes')[scene], 1000, Easing.OUTQUAD); }).img('img/button_back.png').hoverImg('img/button_back_hover.png');
				return Button.create(new V2(0, 600), function() { game.scene = new SlideInDownTransition(require('config/scenes')[scene], 1000, Easing.OUTQUAD); }).img('img/button_back.png').hoverImg('img/button_back_hover.png');
			}
			if (right)
				return Button.create(new V2(0, 600), function() { game.scene = new SlideInRightTransition(require('config/scenes')[scene], 1000, Easing.OUTQUAD); }).img('img/button_back.png').hoverImg('img/button_back_hover.png');
			return Button.create(new V2(0, 600), function() { game.scene = new SlideInLeftTransition(require('config/scenes')[scene], 1000, Easing.OUTQUAD); }).img('img/button_back.png').hoverImg('img/button_back_hover.png');
		}

		return BackButton;
	}
);
