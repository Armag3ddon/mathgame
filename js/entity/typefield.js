define(['basic/entity', 'geo/v2'],
	function(Entity, V2)
	{
		function TypeField(pos) {
			Entity.call(this);
			this.position = pos;

			
		}

		TypeField.prototype = new Entity();

		TypeField.update = function (delta) {

		};

		return TypeField;
	}
);
