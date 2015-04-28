var Model         = require( "zmvc" ).Model;
var Notifications = require( "../definitions/Notifications" );

module.exports = PersonModel;

// declare the new Model

function PersonModel()
{
    Model.base( this, PersonModel.NAME );
    this._persons = [];     // just an Array of String names
}

// inherit from the Model prototype

Model.extend( PersonModel, Model );

/* class properties / methods */

PersonModel.NAME = "PersonModel";   // important : give the Model a unique identifier ! ;)

PersonModel.prototype.getPersons = function()
{
    return this._persons;
};

PersonModel.prototype.hasPerson = function( aName )
{
    return this._persons.indexOf( aName ) > -1;
};

PersonModel.prototype.storePerson = function( aName )
{
    this._persons.push( aName );

    // model has updated, broadcast message
    this.broadcast( Notifications.PERSON_MODEL_UPDATED );
};

PersonModel.prototype.removePerson = function( aName )
{
    this._persons = this._persons.filter( function( person )
    {
        return person !== aName;
    });

    // model has updated, broadcast message
    this.broadcast( Notifications.PERSON_MODEL_UPDATED );
};
