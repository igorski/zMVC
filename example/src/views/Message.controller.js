var Controller    = require( "zmvc" ).Controller;
var Notifications = require( "../definitions/Notifications" );

module.exports = MessageController;

// declare the new Controller

function MessageController()
{
    Controller.base( this );
}

// inherit from the Controller prototype

Controller.extend( MessageController, Controller );

/* class properties / methods */

// return an Array of notification names this Controller should be
// notified of when a message with one of the given names is broadcast
// this is invoked by the framework when the Controller is bound to its View

MessageController.prototype.subscribe = function()
{
    return [
        Notifications.ERROR,
        Notifications.FEEDBACK
    ];
};

// invoked whenever a message of a type supplied in the "subscribe"
// method has been broadcast over the framework

MessageController.prototype.onMessage = function( aMessageType, aMessageData )
{
    switch ( aMessageType )
    {
        case Notifications.ERROR:
            // message data holds String message text
            this.view.showMessage( aMessageData, true );
            break;

        case Notifications.FEEDBACK:
            // message data holds String message text
            this.view.showMessage( aMessageData, false );
            break;
    }
};

// "onInit" is invoked when the Controller has been initialized and paired to its view

MessageController.prototype.onInit = function()
{
    // MessageController has no listeners
};
