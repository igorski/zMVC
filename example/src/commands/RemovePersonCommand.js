var Command       = require( "zmvc" ).Command;
var PersonModel   = require( "../model/PersonModel" );
var Notifications = require( "../definitions/Notifications" );

module.exports = RemovePersonCommand;

// declare the new RemovePersonCommand

function RemovePersonCommand() {}

// inherit from the Model prototype

Command.extend( RemovePersonCommand, Command );

/* class properties / methods */

// invoked by the framework whenever the command is launched

RemovePersonCommand.prototype.execute = function( aMessageType, aMessageData )
{
    console.log( "REMOVE PERSON COMMAND" );

    // grab a reference to the model

    var personModel = this.getModel( PersonModel.NAME );

    // validate data (aMessageData holds the identifier of the Person

    var personId = aMessageData;

    if ( typeof personId === "string" && personId.length > 0 )
    {
        if ( !personModel.hasPerson( personId )) {
            this.broadcast( Notifications.ERROR,
                "a person with name '" + personId + "' did not exist." );
        }
        else {
            personModel.removePerson( personId );
            this.broadcast( Notifications.FEEDBACK,
                "person named '" + personId + "' removed from the model." );
        }
    }
    // all done
    this.done();
};
