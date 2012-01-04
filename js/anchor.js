define( [ "./eventmanager" ], function(){
  
  var Anchor = function( anchorOptions ){
    var _em = new EventManager( this ),
        _type = options.anchorOptions.type,
        _owner = options.anchorOptions.owner,
        _element = options.anchorOptions.element;

    Object.defineProperties( this, {
      type: {
        get: function(){ return _type; },
        set: function( val ){
          _type = val;
        }
      },
      owner: {
        get: function(){ return _owner; }
      },
      element: {
        get: function(){ return _element; }
      }
    });
  }; //Anchor

  return Anchor;
});
