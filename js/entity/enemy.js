define(['basic/entity', 'geo/v2', 'basic/text', 'config/fonts'],
    function(Entity, V2, TextEntity, f)
    {
        function Enemy(pos, options) {
            Entity.call(this, pos);

            var font = f.onscreen;

            this.options = options;
            this.text = [options.op_1,options.operator, options.op_2].join('');
            this.display = new TextEntity(Zero(), this.text, font);

            this.result = eval(this.text);

            this.add(this.display);
        }

        Enemy.prototype = new Entity();

        Enemy.prototype.isBoss = function() {
            return false;
        };

        Enemy.prototype.onUpdate = function (delta) {
            var s = delta > 0 ? new V2(this.options.speed.x / delta, this.options.speed.y / delta) : 0;
            this.position.add(s);

            this.parent.checkEntityForBounds(this, this.position);
        };

        Enemy.prototype.isHitBy = function(val) {
            return val === this.result;
        };

        return Enemy;
    }
);
