define(['lib/scene', 'geo/v2', 'core/graphic', 'lib/animation', 'basic/image'],
    function(Scene, V2, g, Animation, Image) {
        var between = R.betweenInt;

        function PlayScene() {
            Scene.call(this);

        }
        PlayScene.prototype = new Scene();

        return PlayScene;
    }
);
