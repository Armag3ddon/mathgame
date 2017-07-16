define(['core/game'], function(game) {
	return {
		init: function() {
			var self = this;
			document.onkeydown = function( e ) { self.down(e); };
			document.onkeyup   = function( e ) { self.up(e); };
		},

		emit: function( type, key ) {
			if( game.scene && game.scene[type] )
				game.scene[type]( key );
		},

		translate: function( type, code ) {
			switch( code ) {
				case 116: return true; break; // F5
				case 32: this.emit( type, 'space' ); break;
				case 27: this.emit( type, 'esc' ); break;
				case 13: this.emit( type, 'enter' ); break;
				case 8: this.emit( type, 'backspace' ); break;

				case 48: this.emit( type, '0' ); break;
				case 49: this.emit( type, '1' ); break;
				case 50: this.emit( type, '2' ); break;
				case 51: this.emit( type, '3' ); break;
				case 52: this.emit( type, '4' ); break;
				case 53: this.emit( type, '5' ); break;
				case 54: this.emit( type, '6' ); break;
				case 55: this.emit( type, '7' ); break;
				case 56: this.emit( type, '8' ); break;
				case 57: this.emit( type, '9' ); break;

				case 96: this.emit( type, '0' ); break;
				case 97: this.emit( type, '1' ); break;
				case 98: this.emit( type, '2' ); break;
				case 99: this.emit( type, '3' ); break;
				case 100: this.emit( type, '4' ); break;
				case 101: this.emit( type, '5' ); break;
				case 102: this.emit( type, '6' ); break;
				case 103: this.emit( type, '7' ); break;
				case 104: this.emit( type, '8' ); break;
				case 105: this.emit( type, '9' ); break;
			}

			return false;
		},

		down: function(evt) {
			evt = (evt) ? evt : ((event) ? event : null);
			return this.translate( 'down', evt.keyCode );

		},

		up: function(evt) {
			evt = (evt) ? evt : ((event) ? event : null);
			return this.translate( 'up', evt.keyCode );
		}
	}
});
