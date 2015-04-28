/**
 * Created by igorzinken on 19-02-15.
 */
module.exports = Controller;

var Inheritance = require( "zjslib" ).Inheritance;
var Disposable  = require( "zjslib" ).Disposable;
var View        = require( "./View" );
var MVC         = require( "./MVC" );

/**
 * @constructor
 * @extends {Disposable}
 */
function Controller()
{
    Inheritance.super( this );
}

Inheritance.extend( Controller, Disposable );

/* class properties */

/** @public @type {View} */              Controller.prototype.view;
/** @protected @type {Array.<string>} */ Controller.prototype._tokens;

/* public methods */

/**
 * invoked when the Controller has bound
 * itself to a View-instance
 *
 * be sure to invoke this base class function in
 * your derived class override
 *
 * @public
 */
Controller.prototype.init = function()
{
    // register in pubsub
    var notifications = this.subscribe();
    var handler       = this.onMessage.bind( this );

    this._tokens = [];

    notifications.forEach( function( notification )
    {
        this._tokens.push( MVC.Pubsub.subscribe( notification, handler ));

    }.bind( this ));

    this.onInit();
};

/**
 * invoked when the View-instance is removed
 * and Controller should unbind from the View
 *
 * be sure to invoke this base class function in
 * your derived class override
 *
 * @public
 */
Controller.prototype.dispose = function()
{
    // unregister from pubsub
    this._tokens.forEach( function( token )
    {
        MVC.Pubsub.unsubscribe( token );
    });

    Inheritance.super( this, "dispose" );

    this.onDispose();
};

/**
 * list here all notifications the Controller should receive
 * via the pubsub system
 *
 * @public
 * @return {Array.<string>}
 */
Controller.prototype.subscribe = function()
{
    return [];  // extend in derived class
};

/**
 * invoked when the pubsub system has broadcast a
 * message that this Controller is interested in
 *
 * @public
 *
 * @param {string} aMessageType
 * @param {*=} aMessageData
 */
Controller.prototype.onMessage = function( aMessageType, aMessageData )
{
    switch ( aMessageType )
    {
        // extend in derived class
    }
};

/* protected methods */

/**
 * retrieve a model from the framework
 *
 * @public
 *
 * @param {string} aModelName
 */
Controller.prototype.getModel = function( aModelName )
{
    return MVC.getModel( aModelName );
};

/**
 * send a notification message via the pubsub system
 *
 * @protected
 *
 * @param {string} aMessageType
 * @param {*=} aMessageData optional data
 */
Controller.prototype.broadcast = function( aMessageType, aMessageData )
{
    MVC.Pubsub.publish( aMessageType, aMessageData );
};

/**
 * invoked when the Controller initializes
 *
 * @protected
 */
Controller.prototype.onInit = function()
{
    // override in derived prototypes
};

/**
 * invoked when the Controller is disposed
 *
 * @protected
 */
Controller.prototype.onDispose = function()
{
    // override in derived prototypes
};
