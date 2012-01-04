define( [ "./anchor" ], function( Connection ){

  var __id = 0;

  var Node = function( nodeOptions ) {
    var _id = __id++,
        _locked = false;

    Object.defineProperties( this, {
      locked: {
        get: function() { return _locked; },
        set: function( val ) {
          _locked = !!val;
        }
      }
    });
  }; //Node

  var Node = function( nodeOptions ) {

    var _id = __id++,
        xPos = 0,
        yPos = 0,
        locked = false,
        title,
        connections = [],
        inputConnections = {},
        outputConnections = {},
        eventManager = new EventManager( this ),
        numInputs = 0,
        numOutputs = 0,
        node = this;

    var nodeElement = templateNode.cloneNode( true ),
        titleElement = nodeElement.getElementsByClassName( templateTitleClass )[ 0 ],
        bodyElement = nodeElement.getElementsByClassName( templateBodyClass )[ 0 ];

    titleElement.id = "noprobalo-node-title-" + id;

    nodeElement.id = "noprobalo-node-" + id;

    var width = nodeElement.getBoundingClientRect().width,
        height = nodeElement.getBoundingClientRect().height;

    function onTitleMouseDown( e ) {
      var startRect = nodeElement.getBoundingClientRect();
      var mouseDiff = [
            e.clientX - startRect.left,
            e.clientY - startRect.top
          ];
      function onMouseMove( e ) {
        node.x = e.clientX - mouseDiff[ 0 ];
        node.y = e.clientY - mouseDiff[ 1 ];
        for ( var i=0, l=connections.length; i<l; ++i ) {
          connections[ i ].update();
        } //for
      } //onMouseMove
      function onMouseUp( e ) {
        window.removeEventListener( "mousemove", onMouseMove, false );
        window.removeEventListener( "mouseup", onMouseUp, false );
        window.removeEventListener( "keypress", onKeyPress, false );
        stopDrawLoop();
      } //onMouseUp
      function onKeyPress( e ) {
        if ( e.which === 0 ) {
          node.x = startRect.left;
          node.y = startRect.top;
          onMouseUp();
        } //if
      } //onKeyPress
      window.addEventListener( "mousemove", onMouseMove, false );
      window.addEventListener( "mouseup", onMouseUp, false );
      window.addEventListener( "keypress", onKeyPress, false );
      startDrawLoop();
    } //onTitleMouseDown

    this.destroy = function() {
      titleElement.removeEventListener( "mousedown", onTitleMouseDown, false );
    }; //destroy

    Object.defineProperty( this, "locked", {
      set: function( val ) {
        if ( val ) {
          titleElement.removeEventListener( "mousedown", onTitleMouseDown, false );
        }
        else {
          titleElement.addEventListener( "mousedown", onTitleMouseDown, false );
        }
      },
      get: function() {
        return locked;
      }
    });

    Object.defineProperty( this, "x", {
      set: function( val ) { 
        if ( val !== undefined ) {
          xPos = val;
          nodeElement.style.left = xPos + "px";
        }
      },
      get: function() {
        return xPos;
      }
    });

    Object.defineProperty( this, "y", {
      set: function( val ) { 
        if ( val !== undefined ) {
          yPos = val;
          nodeElement.style.top = yPos + "px";
        }
      },
      get: function() {
        return yPos;
      }
    });

    Object.defineProperty( this, "title", {
      get: function() {
        return title;
      },
      set: function( val ) {
        title = val;
        titleElement.innerHTML = val;
      }
    });

    Object.defineProperty( this, "id", {
      get: function() {
        return id;
      }
    });

    function placeConnections() {
      var rect = nodeElement.getBoundingClientRect(),
          inputSpacing = rect.height / numInputs,
          outputSpacing = rect.height / numOutputs,
          i;
      i=0;
      for ( var connectionName in inputConnections ) {
        if ( inputConnections.hasOwnProperty( connectionName ) ) {
          var connection = inputConnections[ connectionName ],
              element = connection.element;
          if ( !connection.element.parentNode ) {
            nodeElement.appendChild( element );
            element.style.left = "-5px";
          } //if
          element.style.top = ( inputSpacing * i + ( inputSpacing / 2.5 ) ) + "px";
          ++i;
        } //if
      } //for
      i=0;
      for ( var connectionName in outputConnections ) {
        if ( outputConnections.hasOwnProperty( connectionName ) ) {
          var connection = outputConnections[ connectionName ],
              element = connection.element;
          if ( !connection.element.parentNode ) {
            nodeElement.appendChild( element );
            element.style.right = "-5px";
          } //if
          element.style.top = ( outputSpacing * i + ( outputSpacing / 1.5 ) ) + "px";
          ++i;
        } //if
      } //for
    } //placeConnections

    var addConnection = this.addConnection = function( type, name, connectionOptions ) {
      if ( type && name ) {
        if ( type === "input" ) {
          ++numInputs;
          inputConnections[ name ] = new Connection({
            name: name,
            className: inputConnectionClassName,
            events: connectionOptions,
            type: type
          });
          connections.push( inputConnections[ name ] );
          placeConnections();
        }
        else if ( type === "output" ) {
          ++numOutputs;
          outputConnections[ name ] = new Connection({
            name: name,
            className: outputConnectionClassName,
            events: connectionOptions,
            type: type
          });
          connections.push( outputConnections[ name ] );
          placeConnections();
        } //if
      } //if
    }; //addConnection

    var getConnection = this.getConnection = function( type, name ) {
      if ( type && name ) {
        if ( type === "input" ) {
          return inputConnections[ name ];
        }
        else if ( type === "output" ) {
          return outputConnections[ name ];
        } //if
      } //if
    }; //getConnection

    var removeConnection = this.removeConnection = function( type, name ) {
      var connection;
      if ( type && name ) {
        if ( type === "input" ) {
          connection = inputConnections[ name ];
          if ( connection ) {
            --numInputs;
            connection.destroy();
            delete inputConnections[ name ];
            connections.splice( connections.indexOf( connection ), 1 );
          }
        }
        else if ( type === "output" ) {
          connection = outputConnections[ name ];
          if ( connection ) {
            --numOutputs;
            connection.destroy();
            delete outputConnections[ name ];
            connections.splice( connections.indexOf( connection ), 1 );
          }
        } //if
      } //if

    }; //removeConnection

    nodeContainer.appendChild( nodeElement );
    node.x = nodeOptions.position[ 0 ];
    node.y = nodeOptions.position[ 1 ];
    node.locked = nodeOptions.locked;
    node.title = nodeOptions.title || "Node" + id;

    if ( nodeOptions.inputs ) {
      for ( var inputName in nodeOptions.inputs ) {
        if ( nodeOptions.inputs.hasOwnProperty( inputName ) ) {
          node.addConnection( "input", inputName, nodeOptions.inputs[ inputName ] );
        } //if
      } //for
    } //if
    if ( nodeOptions.outputs ) {
      for ( var outputName in nodeOptions.outputs ) {
        if ( nodeOptions.outputs.hasOwnProperty( outputName ) ) {
          node.addConnection( "output", outputName, nodeOptions.outputs[ outputName ] );
        } //if
      } //for
    } //if

  }; //Node

  return Node;
});
