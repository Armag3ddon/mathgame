define(['basic/rect', 'geo/v2', 'basic/text', 'config/fonts'],
    function(Rect, V2, TextEntity, f)
    {
        function Enemy(pos, size, color, options) {
            Rect.call(this, pos, size, color);

            var font = f.onscreen;

            this.options = options;
            this.text = [options.op_1,options.operator, options.op_2].join('');
            this.display = new TextEntity(Zero(), this.text, font);

            this.add(this.display);
        }

        Enemy.prototype = new Rect();

        Enemy.prototype.onUpdate = function (delta) {
            var s = delta > 0 ? new V2(this.options.speed.x / delta, this.options.speed.y / delta) : 0;
            this.position.add(s);

            this.parent.checkEntityForBounds(this, this.position);
        };

        Enemy.prototype.onDraw = function() {

        }

        return Enemy;
    }
);
