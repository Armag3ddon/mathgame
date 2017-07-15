define(['basic/entity', 'geo/v2', 'basic/text', 'config/fonts'],
    function(Entity, V2, TextEntity, f)
    {

        // A boss has multiple calculations that have to be solved
        // and does not go away until all solved
        function Boss(pos, options) {
            Entity.call(this, pos);

            var font = f.onscreen;

            this.options = options;

            this.operations = options.operations;

            this.text = '';
            this.operations.forEach(function(op) {
                this.text += ['(', op.op_1, op.operator, op.op_2, ')', '+'].join('');
            }.bind(this));

            // remove trailing +
            this.text = this.text.substr(0, this.text.length - 1);

            console.log(this.text);

            this.display = new TextEntity(Zero(), this.text, font);

            this.result = eval(this.text);

            this.add(this.display);
        }

        Boss.prototype = new Entity();

        Boss.prototype.isBoss = function() {
            return true;
        };

        Boss.prototype.onUpdate = function (delta) {
            var s = delta > 0 ? new V2(this.options.speed.x / delta, this.options.speed.y / delta) : 0;
            this.position.add(s);

            this.parent.checkEntityForBounds(this, this.position);
        };

        Boss.prototype.isHitBy = function(val) {
            return val === this.result;
        };

        return Boss;
    }
);
