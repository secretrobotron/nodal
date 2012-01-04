define( [], function(){

  var util = {
    getElementOrClass: function( name, root ){
      if( typeof name !== "string" ){
        return name;
      } //if
      var output,
          root = root || document;
      if( name.indexOf( "." ) === 0 ){
        output = root.getElementsByClassName( name.substr( 1 ) );
      }
      else if( name.indexOf( "#" ) === 0 ){
        output = root.getElementById( name.substr( 1 ) );
      } //if
      if( output.length === 1 ){
        return output[ 0 ];
      }
      return output;
    } //getElementOrClass
  }; //util

  return util;
});
