define( [], function() {

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

  function Canvas( canvasElement ) {
    var _canvasElement = canvasElement
        _ctx = canvasElement.getContext( "2d" )
        _stopFlag = false;

    function draw() {
      ctx.clearRect( 0, 0, nodeCanvas.width, nodeCanvas.height );
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for ( var i=0, l=lines.length; i<l; ++i ) {
        lines[ i ].draw();
      } //for
      ctx.stroke();
      if( !_stopFlag ) {
        requestAnimFrame( draw, nodeCanvas );
      }
    } //draw

    this.start = function() {
      _stopFlag = false;
      requestAnimFrame( draw, nodeCanvas );
    }; //start

    this.stop = function() {
      _stopFlag = true;
    }; //stop

  } //Canvas

  return Canvas;

});
