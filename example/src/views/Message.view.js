var View = require( "zMVC" ).View;

module.exports = MessageView;

// declare the new View

function MessageView( aElement )
{
    View.base( this, aElement );
}

// inherit from the View prototype

View.extend( MessageView, View );

/* class properties / methods */

MessageView.NAME = "MessageView";       // important : give the View a unique identifier ! ;)

// "init" is invoked when the View has been initialized

MessageView.prototype.init = function()
{
    // MessageView has no preparations
};

MessageView.prototype.showMessage = function( aMessage, isError )
{
    this._element.innerHTML = aMessage;

    if ( isError )
        this._element.classList.add( "error" );
    else
        this._element.classList.remove( "error" );
};
