var View = require( "zMVC" ).View;

module.exports = FormView;

// declare the new View

function FormView( aElement )
{
    View.base( this, aElement );
}

// inherit from the View prototype

View.extend( FormView, View );

/* class properties / methods */

FormView.NAME = "FormView";       // important : give the View a unique identifier ! ;)

// "init" is invoked when the View has been initialized

FormView.prototype.init = function()
{
    // retrieve references to elements inside the HTML layout
    // NOTE : "aElement" passed in the constructor is now available under this._element

    this.inputField   = this._element.querySelector( "input[type=text]" );
    this.submitButton = this._element.querySelector( "input[type=submit]" );
};
