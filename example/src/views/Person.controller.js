var Controller    = require( "zmvc" ).Controller;
var Notifications = require( "../definitions/Notifications" );
var PersonModel   = require( "../model/PersonModel" );

module.exports = PersonController;

// declare the new Controller

function PersonController()
{
    Controller.base( this );
}

// inherit from the Controller prototype

Controller.extend( PersonController, Controller );

/* class properties / methods */

// return an Array of notification names this Controller should be
// notified of when a message with one of the given names is broadcast
// this is invoked by the framework when the Controller is bound to its View

PersonController.prototype.subscribe = function()
{
    return [ Notifications.PERSON_MODEL_UPDATED ];
};

// invoked whenever a message of a type supplied in the "subscribe"
// method has been broadcast over the framework

PersonController.prototype.onMessage = function( aMessageType, aMessageData )
{
    switch ( aMessageType )
    {
        // model data has mutated, update the view to show the current data

        case Notifications.PERSON_MODEL_UPDATED:
            this.view.showPersons( this.getModel( PersonModel.NAME ).getPersons() );
            break;
    }
};

// "onInit" is invoked when the Controller has been initialized and paired to its view

PersonController.prototype.onInit = function()
{
    // when the views container is clicked, remove the associated person from the model
    this.view.container.addEventListener( "click", function( e )
    {
        var personId = e.target.dataset.id;

        if ( personId ) {
            this.broadcast( Notifications.REMOVE_PERSON, personId );
        }

    }.bind( this ));
};
