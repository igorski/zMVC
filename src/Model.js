/**
 * Created by igorzinken on 21-02-15.
 *
 * a Model can be used to hold data
 * It has a unique identifier name which is used to
 * retrieve it from the MVC Object
 */
var MVC = require( "./MVC" );

module.exports = Model;

function Model( aName )
{
    this._name = aName;
}

/* class properties */

/** @protected @type {string} */ Model.prototype._name;

/* public methods */

/**
 * @public
 *
 * @return {string}
 */
Model.prototype.getName = function()
{
    return this._name;
};

/* protected methods */

/**
 * send a notification message via the pubsub system
 *
 * @protected
 *
 * @param {string} aMessageType
 * @param {*=} aMessageData optional data
 */
Model.prototype.broadcast = function( aMessageType, aMessageData )
{
    MVC.Pubsub.publish( aMessageType, aMessageData );
};
