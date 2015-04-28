var Command       = require( "zmvc" ).Command;
var PersonModel   = require( "../model/PersonModel" );
var Notifications = require( "../definitions/Notifications" );

module.exports = AddPersonCommand;

// declare the new AddPersonCommand

function AddPersonCommand() {}

// inherit from the Model prototype

Command.extend( AddPersonCommand, Command );

/* class properties / methods */

// invoked by the framework whenever the command is launched

AddPersonCommand.prototype.execute = function( aMessageType, aMessageData )
{
    console.log( "ADD PERSON COMMAND" );

    // grab a reference to the model

    var personModel = this.getModel( PersonModel.NAME );

    // validate data (aMessageData holds the value from
    // the form input field, submitted by Form.Controller

    var personId = aMessageData;

    if ( typeof personId === "string" && personId.length > 0 )
    {
        if ( personModel.hasPerson( personId )) {
            this.broadcast( Notifications.ERROR,
                "a person with name '" + personId + "' already existed." );
        }
        else {
            personModel.storePerson( personId );
            this.broadcast( Notifications.FEEDBACK,
                "person named '" + personId + "' added to the model." );
        }
    }
    else {
        this.broadcast( Notifications.ERROR,
            "form value '" + personId + "' is an invalid name." );
    }

    // all done
    this.done();
};
