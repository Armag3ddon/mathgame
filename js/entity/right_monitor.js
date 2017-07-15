define(['basic/entity', 'geo/v2', 'basic/text', 'config/fonts'],
    function(Entity, V2, TextEntity, f)
    {
        function RightMonitor(pos, options) {
            Entity.call(this, pos, options.size);

            var font = f.onscreen;

            this.options = options;
            this.text = 'Combo modifier:';
            this.display = new TextEntity(Zero(), this.text, font);

            this.add(this.display);

            this.time_to_new_modifier = 4343;
            this._time_number = 100;
        }

        RightMonitor.prototype = new Entity();

        RightMonitor.prototype.onUpdate = function (delta) {

            if (this._time_number < 0) {
                this.addNewModifier();
                this._time_number = this.time_to_new_modifier;
            }

            this._time_number -= delta;
        };

        RightMonitor.prototype.addNewModifier = function() {
            this.display.text = this.parent.getNewComboModifier();
            this.center(this.display);
        };

        return RightMonitor;
    }
);