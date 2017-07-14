define(['basic/rect', 'geo/v2'],
    function(Rect, V2)
    {
        function Enemy(pos, options) {
            Rect.call(this);
            this.position = pos;
            this.options = options;
            this.size = new V2(5, 5);

            console.log('spawned new enemy ', options);
        }

        Enemy.prototype = new Rect();

        Enemy.prototype.onUpdate = function (delta) {

        };

        return Enemy;
    }
);
