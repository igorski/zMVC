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

// add convenience methods to easily extend derived classes

var Inheritance = require( "zjslib" ).Inheritance;

zMVC.Command.extend      =
zMVC.MacroCommand.extend =
zMVC.Controller.extend   =
zMVC.Model.extend        =
zMVC.View.extend         = function( aExtendedPrototype, aSuperPrototype )
{
    Inheritance.extend( aExtendedPrototype, aSuperPrototype );
};

zMVC.Command.base      =
zMVC.MacroCommand.base =
zMVC.Controller.base   =
zMVC.Model.base        =
zMVC.View.base         = function( classInstance, optMethodName )
{
    var caller = arguments.callee.caller;

    if ( caller.super ) {
        return caller.super.constructor.apply( classInstance,
                                               Array.prototype.slice.call( arguments, 1 ));
    }
    var args = Array.prototype.slice.call( arguments, 2 ), foundCaller = false;

    for ( var ctor = classInstance.constructor; ctor;
          ctor = ctor.super && ctor.super.constructor )
    {
        if ( ctor.prototype[ optMethodName ] === caller )
            foundCaller = true;
        else if ( foundCaller )
            return ctor.prototype[ optMethodName ].apply( classInstance, args );
    }
};
