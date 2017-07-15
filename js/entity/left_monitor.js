define(['basic/entity', 'geo/v2', 'basic/text', 'config/fonts'],
    function(Entity, V2, TextEntity, f)
    {
        function LeftMonitor(pos, options) {
            Entity.call(this, pos);

            var font = f.onscreen;

            this.options = options;
            this.text = 'Left monitor stuff';
            this.display = new TextEntity(Zero(), this.text, font);

            this.add(this.display);
        }

        LeftMonitor.prototype = new Entity();

        LeftMonitor.prototype.onUpdate = function (delta) {

        };

        return LeftMonitor;
    }
);
