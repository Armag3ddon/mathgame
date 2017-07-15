define(['definition/font'], function(FontStyle) {
	return {
		default: new FontStyle(40, '#000', 'sans-serif', '#555' ),
		frames: new FontStyle(12, '#000', 'monospace' ),
		onscreen: new FontStyle(25, '#33cc33', 'monospace' ),
		onscreen_left: new FontStyle(25, '#33cc33', 'monospace', false, 'start')
	};
});
