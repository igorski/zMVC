/**
 * expose the separate actors of the library
 */
var zMVC = module.exports =
{
    Command      : require( "./src/Command" ),
    Controller   : require( "./src/Controller" ),
    MacroCommand : require( "./src/MacroCommand" ),
    Model        : require( "./src/Model" ),
    MVC          : require( "./src/MVC" ),
    View         : require( "./src/View" )
};

// add a convenience method to easily extend derived classes

var Inheritance = require( "zjslib" ).Inheritance;

zMVC.Command.extend      =
zMVC.MacroCommand.extend =
zMVC.Controller.extend   =
zMVC.Model.extend        =
zMVC.View.extend         = function( aExtendedPrototype, aSuperPrototype )
{
    Inheritance.extend( aExtendedPrototype, aSuperPrototype );
};
