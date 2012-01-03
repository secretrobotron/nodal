define( [], function(){

  function Endpoint( inputX, inputY ) {
    var x, oldX, y, oldY;
    x = inputX || 0;
    oldX = x;
    y = inputY || 0;
    oldY = y;

    Object.defineProperty( this, "x", {
      get: function() { return x; },
      set: function( val ) { oldX = x; x = val; }
    });
    Object.defineProperty( this, "y", {
      get: function() { return y; },
      set: function( val ) { oldY = y; y = val; }
    });
  } //Endpoint

  return Endpoint;
});
