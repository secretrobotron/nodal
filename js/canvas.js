define( [], function(){

  var requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(callback, element){
                window.setTimeout(callback, 1000 / 60);
              };
  })();

  var Canvas = function( canvasElement ){
    var _ctx = canvasElement.getContext( "2d" ),
        _stopFlag = false,
        _lines = [];

    function draw() {
      ctx.clearRect( 0, 0, nodeCanvas.width, nodeCanvas.height );
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for ( var i=0, l=_lines.length; i<l; ++i ) {
        _lines[ i ].draw();
      } //for
      ctx.stroke();
      if( !_stopFlag ) {
        requestAnimFrame( draw, nodeCanvas );
      }
    } //draw

    this.start = function(){
      _stopFlag = false;
      requestAnimFrame( draw, nodeCanvas );
    }; //start

    this.stop = function(){
      _stopFlag = true;
    }; //stop

    this.addLine = function( line ){
      _lines.push( line );
      return line;
    }; //addLine

    this.removeLine = function( line ){
      var idx = _lines.indexOf( line );
      if( idx > -1 ){
        _lines.splice( idx, 1 );
      } //if
      return line;
    }; //removeLine

  };

  return Canvas;

});
