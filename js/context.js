define( [ "util", "nodetemplate", "node", "canvas" ], function( util, NodeTemplate, Node, Canvas ){
  
  function Context( contextOptions ){
    var _nodes = [];

    var _area = {
      container: util.getElementOrClass( contextOptions.area.container ),
      canvas: util.getElementOrClass( contextOptions.area.canvas )
    };
    var _nodeTemplate = new NodeTemplate( contextOptions.node );

    this.createNode = function( position ){
      var node = new Node({
        position: position
      });
      _nodes.push( node );
      return node;
    }; //createNode

    this.removeNode = function( node ){
      var idx = _nodes.indexOf( node );
      if( idx > -1 ){
        _nodes.splice( idx, 1 );
      } //if
      node.destroy();
      return node;
    }; //removeNode

    Object.defineProperties( this, {
      nodes: {
        get: function(){ return _nodes; }
      }
    });

  } //Context

  return Context;

});
