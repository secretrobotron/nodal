define( [ "./eventmanager" ], function( EventManager ) {

  var Connection = function( connectionOptions ) {
    var eventManager = new EventManager( this ),
        containerElement = document.createElement( "div" ),
        markerElement = document.createElement( "div" ),
        titleElement = document.createElement( "span" ),
        type = connectionOptions.type,
        connection = this,
        otherConnections = [],
        endpoints = [];

    if ( connectionOptions.events && connectionOptions.events.connect ) {
      connection.listen( "connectionconnected", connectionOptions.events.connect );
    } //if
    containerElement.className = connectionOptions.className;
    titleElement.innerHTML = connectionOptions.name;
    titleElement.className = connectionOptions.className + "-title";
    markerElement.className = connectionOptions.className + "-marker";
    containerElement.appendChild( markerElement );
    containerElement.appendChild( titleElement );

    Object.defineProperty( this, "owner", {
      get: function() { return node; }
    });

    Object.defineProperty( this, "element", {
      get: function() {
        return containerElement;
      }
    });

    Object.defineProperty( this, "type", {
      get: function() {
        return type;
      }
    });

    this.connectTo = function( other ) {
      otherConnections.push( other );
    }; //connectTo

    this.connectedTo = function( other ) {
      return otherConnections.indexOf( other ) > -1;
    }; //other

    this.update = function() {
      var rect = markerElement.getBoundingClientRect();
      for ( var i=0, l=endpoints.length; i<l; ++i ) {
        endpoints[ i ].x = rect.left + rect.width / 2;
        endpoints[ i ].y = rect.top + rect.height / 2;
      } //for
    } //update

    this.storeEndpoint = function( endpoint ) {
      endpoints.push( endpoint );
    }; //storeEndpoint

    function onMouseDown( e ) {
      var rect = markerElement.getBoundingClientRect();
      var line = new Line({
        startX: rect.left + rect.width / 2,
        startY: rect.top + rect.height / 2
      });

      otherConnection = undefined;

      function onMouseMove( e ) {
        line.end.x = e.clientX;
        line.end.y = e.clientY;
      } //onMouseMove

      function onMouseUp( e, noSave ) {
        window.removeEventListener( "mouseup", onMouseUp, false );
        window.removeEventListener( "mousemove", onMouseMove, false );
        window.removeEventListener( "keypress", onKeyPress, false );
        if ( noSave !== false ) {
          connection.storeEndpoint( line.start );
        } //if
        requestAnimFrame( stopDrawLoop, nodeCanvas );
        markerElement.addEventListener( "mouseover", onMouseOver, false );
        markerElement.addEventListener( "mouseout", onMouseOut, false );
        if (  otherConnection && 
              otherConnection.owner !== node &&
              otherConnection.type !== connection.type &&
              !otherConnection.connectedTo( connection ) ) {
          otherConnection.storeEndpoint( line.end );
          otherConnection.connectTo( connection );
          connection.connectTo( otherConnection );
          eventManager.dispatch( "connectionconnected", {
            nput: otherConnection.type === "input" ? otherConnection : connection,
            output: otherConnection.type === "output" ? otherConnection : connection,
            start: connection,
            end: otherConnection
          });
        }
        else {
          line.destroy();
        } //if
        otherConnection = undefined;
      } //onMouseUp 
      function onKeyPress( e ) {
        if ( e.which === 0 ) {
          onMouseUp( e, false );
          line.destroy();
        } //if
      } //onKeyPress
      window.addEventListener( "mousemove", onMouseMove, false );
      window.addEventListener( "mouseup", onMouseUp, false );
      window.addEventListener( "keypress", onKeyPress, false );

      startDrawLoop();
      markerElement.removeEventListener( "mouseover", onMouseOver, false );
      markerElement.removeEventListener( "mouseout", onMouseOut, false );
      eventManager.dispatch( "connectionstarted" );
    } //onMouseDown

    function onMouseOver( e ) {
      otherConnection = connection;
    } //onMouseDown

    function onMouseOut( e ) {
      otherConnection = undefined;
    } //onMouseOut

    this.destroy = function() {
      markerElement.removeEventListener( "mousedown", onMouseDown, false );
      markerElement.removeEventListener( "mouseover", onMouseOver, false );
      markerElement.removeEventListener( "mouseout", onMouseOut, false );
    }; //destroy

    markerElement.addEventListener( "mousedown", onMouseDown, false );
    markerElement.addEventListener( "mouseover", onMouseOver, false );
    markerElement.addEventListener( "mouseout", onMouseOut, false );
  }; //Connection

  return Connection;
});
