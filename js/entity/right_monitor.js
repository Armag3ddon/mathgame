define(['basic/entity', 'geo/v2', 'basic/text', 'config/fonts'],
    function(Entity, V2, TextEntity, f)
    {
        function RightMonitor(pos, options) {
            Entity.call(this, pos);

            var font = f.onscreen;

            this.options = options;
            this.text = 'Right monitor stuff';
            this.display = new TextEntity(Zero(), this.text, font);

            this.add(this.display);
        }

        RightMonitor.prototype = new Entity();

        RightMonitor.prototype.onUpdate = function (delta) {

        };

        return RightMonitor;
    }
);