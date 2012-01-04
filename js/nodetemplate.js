define( [ "util" ], function( util ){

  var NodeTemplate = function( options ){
    var _container = util.getElementOrClass( options.template ),
        _title = options.title,
        _body = options.body;

    this.generate = function( title ){
      var copy = _container.cloneNode( true ),
          titleElement = util.getElementOrClass( _title, copy );

      if( titleElement ) {
        titleElement.innerHTML = title;
      } //if

      return copy;
    }; //generate

    if( _container && _container.parentNode ){
      _container.parentNode.removeChild( _container );
    } //if

  }; //NodeTemplate

  return NodeTemplate;
});
