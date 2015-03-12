/**
 * Created by igorzinken on 19-02-15.
 *
 * MVC provides a framework that separates Model, View, Controller
 * Actors into separate tiers
 */
var MVC = module.exports = {};

var ArrayUtil  = require( "zjslib" ).utils.ArrayUtil;
var View       = require( "./View" );
var Controller = require( "./Controller" );
var Pubsub     = require( "pubsub-js" );

/* class properties */

/** @private @type {Object} */          MVC._models           = {};
/** @private @type {Object} */          MVC._views            = {};
/** @private @type {Object} */          MVC._commands         = {};
/** @private @type {Array.<Command>} */ MVC._runningCommands  = [];
/** @public @type {View} */             MVC.stage; // will reference the main view

/* public methods */

/**
 * register a View-prototype to a Controller by the View.NAME
 *
 * @public
 * @param {function(new: View)} aView
 * @param {function(new: Controller)} aController
 */
MVC.registerView = function( aView, aController )
{
    if ( !aView.NAME || aView.NAME === "View" ) {
        throw new Error( "derived View class '" + aView + "' requires a unique NAME-identifier" );
    }
    MVC._views[ aView.NAME ] = aController;
};

/**
 * unregister given View-prototype from the framework
 *
 * @public
 *
 * @param {function(new: View)} aView
 */
MVC.unregisterView = function( aView )
{
    delete MVC._views[ aView.NAME ];
};

/**
 * register given Model-instance to the framework
 *
 * @public
 * @param {Model} aModel
 */
MVC.registerModel = function( aModel )
{
    MVC._models[ aModel.getName() ] = aModel;
};

/**
 * unregister given Model-instance from the framework
 *
 * @public
 * @param {Model} aModel
 */
MVC.unregisterModel = function( aModel )
{
    delete MVC._models[ aModel.getName() ];
};

/**
 * @public
 * @param {string} aModelName
 * @return {Model}
 */
MVC.getModel = function( aModelName )
{
    var model = MVC._models[ aModelName ];

    if ( model )
        return model;

    throw new Error( "could not retrieve model for '" + aModelName + "' (was it registered?) ");
};

/**
 * register a Command to be launched whenever given aMessageType
 * is broadcast over the pubsub system
 *
 * NOTE : only ONE command per unique messageType. MessageType
 * cannot be shared with other subscribed watchers, it is COMMAND ONLY
 *
 * @public
 *
 * @param {string} aMessageType
 * @param {Command} aCommandRef
 */
MVC.registerCommand = function( aMessageType, aCommandRef )
{
    MVC._commands[ aMessageType ] = aCommandRef;

    Pubsub.subscribe( aMessageType, MVC.launchCommand );
};

/**
 * @public
 * @param {string} aMessageType
 */
MVC.unregisterCommand = function( aMessageType )
{
    delete MVC._commands[ aMessageType ];

    Pubsub.unsubscribe( aMessageType );
};

/**
 * send a notification message via the pubsub system
 *
 * @public
 *
 * @param {string} aMessageType
 * @param {*=} aMessageData optional data
 */
MVC.broadcast = function( aMessageType, aMessageData )
{
    Pubsub.publish( aMessageType, aMessageData );
};

/* framework "internals" */

/**
 * invoked when a View is added to the Stage/DOM, this method
 * will construct and bind the registered Controller to the view
 * and invoke the Controllers "init"-method
 *
 * @public
 * @param {View} aView
 */
MVC.bindView = function( aView )
{
    var viewName      = aView.constructor.NAME;
    var controllerRef = MVC._views[ viewName ];

    if ( controllerRef )
    {
        console.log( "zMVC::BINDING CONTROLLER TO VIEW '" + viewName + "'" );
        
        var controller   = new controllerRef();
        aView.controller = controller;
        controller.view  = aView;

        controller.init();
    }
};

/**
 * invoked when a View is removed from the Stage/DOM, this method
 * will unbind the registered Controller from the View and invoke
 * its "onRemove"-method
 *
 * NOTE : the Controller is NOT disposed and can be re-bound when
 * the View is added to the Stage/DOM once more
 *
 * @public
 * @param {View} aView
 */
MVC.unbindView = function( aView )
{
    var controller = aView.controller;

    if ( controller )
    {
        console.log( "zMVC::UNBINDING CONTROLLER FROM VIEW '" + aView.constructor.NAME + "'" );

        controller.dispose();
    }
    aView.dispose();
};

/**
 * invoked by a Command when it has finished its execution
 *
 * @public
 * @param {Command} aCommand
 */
MVC.removeCommand = function( aCommand )
{
    ArrayUtil.removeItem( MVC._runningCommands, aCommand );
};

/* protected methods */

/**
 * invoked internally whenever the pubsub system receives a message
 * that is registered to launch a Command
 *
 * @protected
 *
 * @param {string} aMessageType
 * @param {*=} aMessageData optional message data
 */
MVC.launchCommand = function( aMessageType, aMessageData )
{
    var command = MVC._commands[ aMessageType ];

    if ( command ) {
        var cmdInstance = new command();
        MVC._runningCommands.push( cmdInstance );

        cmdInstance.execute( aMessageType, aMessageData );
    }
};
