define( [ "./endpoint" ], function( Endpoint ){

  var Line = function( lineOptions ) {
    var _startEndpoint = new Endpoint( lineOptions.startX, lineOptions.startY ),
        _endEndpoint = new Endpoint( lineOptions.startX, lineOptions.startY ),
        _this = this;

    this.draw = function( ctx ) {
      ctx.moveTo( _startEndpoint.x, _startEndpoint.y );
      ctx.lineTo( _endEndpoint.x, _endEndpoint.y );
    }; //draw

    Object.defineProperty( this, "start", { get: function() { return _startEndpoint; } } );
    Object.defineProperty( this, "end", { get: function() { return _endEndpoint; } } );

  }; //Line

  return Line;
});
