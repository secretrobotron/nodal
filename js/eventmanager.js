define( [], function(){

  const EVENT_LOOP_PAUSE = 0;

  var EventLoop = function() {
    var _events = []
        _started = false;

    function processEvents() {
      var events = _events,
          listeners, event, j, jl;
      _events = [];
      for( var i=0, l=events.length; i<l; ++i ) {
        listeners = events[ i ].listeners;
        event = events[ i ].event;
        for( j=0, jl=listeners.length; j < jl; ++j ) {
          listeners[ j ]( event );
        } //for
      } //for
      if( _events.length > 0 ) {
        setTimeout( processEvents, EVENT_LOOP_PAUSE );
      }
      else {
        _started = false;
      } //if
    } //processEvents

    this.addEvent = function( e, listeners ) {
      _events.push({
        event: e,
        listeners: listeners
      });
    }; //addEvent

    this.start = function() {
      if( !_started ) {
        _started = true;
        setTimeout( processEvents, EVENT_LOOP_PAUSE );
      } //if
    }; //start
  }; //EventLoop
  var __eventLoop = new EventLoop();

  var Event = function( type, data ) {
    var _type = type + "",
        _data = data;
    Object.defineProperty( this, "type", { get: function() { return _type; } } );
    Object.defineProperty( this, "data", { get: function() { return _data; } } );
  }; //Event

  var EventManager = function( object ) {
    var _listeners = [],
        _this = this;

    this.dispatch = function( eventName, eventData ) {
      var e = {
        type: eventName + "",
        data: eventData
      };
      if( _listeners[ eventName ] ) {
        __eventLoop.addEvent( e, _listeners[ eventName ].slice() );
        __eventLoop.start();
      } //if
    }; //dispatch

    this.listen = function( eventName, listener ) {
      if ( !_listeners[ eventName ] ) {
        _listeners[ eventName ] = [];
      }
      _listeners[ eventName ].push( listener );
    }; //listen

    this.unlisten = function( eventName, listener ) {
      var theseListeners = _listeners[ eventName ];
      if ( theseListeners ) {
        if ( listener ) {
          var idx = theseListeners.indexOf( listener );
          if ( idx > -1 ) {
            theseListeners.splice( idx, 1 );
          } //if
        }
        else {
          _listeners[ eventName ] = [];
        }
      } //if
    }; //unlisten

    this.apply = function( object ) {
      object.listen = _this.listen;
      object.unlisten = _this.unlisten;
      object.dispatch = _this.dispatch;
    }; //apply

    if( object ) {
      this.apply( object );
    } //if

  }; //EventManager

  return EventManager;

});
