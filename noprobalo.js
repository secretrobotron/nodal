(function(){

  var NoProbalo = function( npOptions ) {

    var templateNode = document.getElementById( npOptions.template ),
        templateTitleClass = npOptions.templateTitle,
        templateBodyClass = npOptions.templateBody,
        nodeContainer = document.getElementById( npOptions.container ),
        nodeCanvas = document.getElementById( npOptions.canvas ),
        inputConnectionClassName = npOptions.inputConnectionClass,
        outputConnectionClassName = npOptions.outputConnectionClass,
        nodes = [],
        lines = [],
        otherConnection,
        np = this;

    this.createNode = function( nodeOptions ) {
      var n = new Node( nodeOptions );
      nodes.push( n );
      return n;
    }; //createNode

    this.removeNode = function( node ) {
      var idx = nodes.indexOf( node );
      if ( idx > -1 ) {
        nodes.splice( idx, 1 );
        node.destroy();
      } //if
    }; //removeNode

    Object.defineProperty( this, "numNodes", { get: function() { return nodes.length; } } );

    if ( templateNode.parentNode ) {
      templateNode.parentNode.removeChild( templateNode );
    } //if

  }; //NoProbalo

  window.NoProbalo = function( options ) {
    return new NoProbalo( options );
  };
})();
