define(['basic/rect', 'geo/v2'],
    function(Rect, V2)
    {
        function Enemy(pos, size, color, options) {
            Rect.call(this, pos, size, color);

            this.options = options;

            //console.log('spawned new enemy ', this.options);
        }

        Enemy.prototype = new Rect();

        Enemy.prototype.onUpdate = function (delta) {
            var s = delta > 0 ? new V2(this.options.speed.x / delta, this.options.speed.y / delta) : 0;
            this.position.add(s);
        };

        return Enemy;
    }
);
