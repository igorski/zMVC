/**
 * Created by igorzinken on 28-02-15.
 */
module.exports = MacroCommand;

var Inheritance = require( "zjslib" ).Inheritance;
var Command     = require( "./Command" );

/**
 * MacroCommand can be used to chain multiple
 * Commands to be executed in sequence
 *
 * @constructor
 * @extends {Command}
 */
function MacroCommand()
{
    Inheritance.super( this );

    this._subCommands = [];
    this.init();
    this.run();
}

Inheritance.extend( MacroCommand, Command );

/* class properties */

/** @protected @type {Array.<function(new: Command)>} */ MacroCommand.prototype._subCommands;
/** @protected @type {Command} */                        MacroCommand.prototype._runningCommand;
/** @protected @type {string} */                         MacroCommand.prototype._messageType;
/** @protected @type {*} */                              MacroCommand.prototype._messageData;

/* public methods */

/**
 * @override
 * @public
 *
 * @param {string} aMessageType
 * @param {*=} aMessageData optional message data
 */
MacroCommand.prototype.execute = function( aMessageType, aMessageData )
{
    // store a reference to the message type and data
    // so we can pass these on to the subcommands

    this._messageType = aMessageType;
    this._messageData = aMessageData;
};

/* protected methods */

/**
 * @protected
 */
MacroCommand.prototype.init = function()
{
    // override in derived classes
    // to add sub commands
    // this.addSubCommand( CommandReference ); ...
};

/**
 * @protected
 *
 * @param {function(new: Command)} aCommandRef
 */
MacroCommand.prototype.addSubCommand = function( aCommandRef )
{
    this._subCommands.push( aCommandRef );
};

/**
 * @protected
 */
MacroCommand.prototype.run = function()
{
    if ( this._subCommands.length === 0 )
    {
        this.done();
    }
    else {
        var commandRef = this._subCommands.shift();
        var command    = new commandRef();

        this._runningCommand = command;

        // override the complete and cancel handlers
        // so the MacroCommand can handle these states internally

        command.done = function()
        {
            this.run();

        }.bind( this );

        command.cancel = function()
        {
            this.cancel();

        }.bind( this );

        // launch the command

        command.execute( this._messageType, this._messageData );
    }
};
