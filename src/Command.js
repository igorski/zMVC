module.exports = Command;

var MVC = require( "./MVC" );

/**
 * Command provides an interface to execute (asynchronous)
 * logic whenever a notification is fired via pubsub
 *
 * @constructor
 */
function Command()
{

}

/* public methods */

/**
 * invoked by MVC when the Command is constructed
 *
 * @param {string} aMessageType the pubsub message type
 * @param {*} aMessageData optional message data
 */
Command.prototype.execute = function( aMessageType, aMessageData )
{

};

/* protected methods */

/**
 * retrieve a model from the framework
 *
 * @public
 *
 * @param {string} aModelName
 */
Command.prototype.getModel = function( aModelName )
{
    return MVC.getModel( aModelName );
};

/**
 * send a notification message via the pubsub system
 *
 * @protected
 *
 * @param {string} aMessageType
 * @param {*=} aMessageData optional message data
 */
Command.prototype.broadcast = function( aMessageType, aMessageData )
{
    MVC.Pubsub.publish( aMessageType, aMessageData );
};

/**
 * invoke whenever the Command has completed its operation
 * successfully
 *
 * @protected
 */
Command.prototype.done = function()
{
    MVC.removeCommand( this );
};

/**
 * invoke whenever the Command should cancel its operation
 * (for instance because its operation failed)
 *
 * @protected
 */
Command.prototype.cancel = function()
{
    MVC.removeCommand( this ); // currently identical to complete
};
