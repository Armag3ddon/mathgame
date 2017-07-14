define(['basic/entity', 'geo/v2'],
	function(Entity, V2)
	{
		function Controller(pos) {
			Entity.call(this);
			this.position = pos;
		}

		Controller.prototype = new Entity();

		Controller.update = function (delta) {
			
		};

		return Controller;
	}
);
