var Controller    = require( "zmvc" ).Controller;
var Notifications = require( "../definitions/Notifications" );

module.exports = FormController;

// declare the new Controller

function FormController()
{
    Controller.base( this );
}

// inherit from the Controller prototype

Controller.extend( FormController, Controller );

/* class properties / methods */

// "onInit" is invoked when the Controller has been initialized and paired to its view

FormController.prototype.onInit = function()
{
    // add a listener to the forms submit button

    this.view.submitButton.addEventListener( "click", function( e )
    {
        e.preventDefault();                     // prevent page refresh
        var value = this.view.inputField.value; // get input field value

        this.broadcast( Notifications.ADD_PERSON, value );

    }.bind( this ));
};
