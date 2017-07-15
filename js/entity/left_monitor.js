define(['basic/entity', 'geo/v2', 'basic/text', 'config/fonts'],
    function(Entity, V2, TextEntity, f)
    {
        function LeftMonitor(pos, options) {
            Entity.call(this, pos);

            this.options = options;

            //this.display = new TextEntity(Zero(), this.text, font);

            this.numbers = [];

            this.time_to_new_number = 650;
            this._time_number = 0;
        }

        LeftMonitor.prototype = new Entity();

        LeftMonitor.prototype.onUpdate = function (delta) {
            if (this._time_number <= 0) {
                this.addNumber();

                this._time_number = this.time_to_new_number;
            }

            this.entities.forEach(function(e) {
                e.position.x -= 1;
            }.bind(this));

            this.entities = this.entities.filter(function(e) {
                return e.position.x > -225;
            });

            this._time_number -= delta;
        };

        LeftMonitor.prototype.addNumber = function() {
            var font = f.onscreen;
            var res = this.parent.getNumberForMonitor();
            var t = new TextEntity(Zero(), res.val, font);
            if (!res.real) {
                t.override_color = '#aa0000'
            }
            this.add(t);
        };


        return LeftMonitor;
    }
);
