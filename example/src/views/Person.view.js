var View = require( "zMVC" ).View;

module.exports = PersonView;

// declare the new View

function PersonView( aElement )
{
    View.base( this, aElement );
}

// inherit from the View prototype

View.extend( PersonView, View );

/* class properties / methods */

PersonView.NAME = "PersonView";       // important : give the View a unique identifier ! ;)

PersonView.prototype.container;

// "init" is invoked when the View has been initialized

PersonView.prototype.init = function()
{
    // retrieve references to elements inside the HTML layout
    // NOTE : "aElement" passed in the constructor is now available under this._element

    this.container = this._element.querySelector( "[data-role=container]" );
};

PersonView.prototype.showPersons = function( aPersons )
{
    var HTML = "";

    // add each person to the list

    aPersons.forEach( function( name )
    {
        HTML += "<li data-id=\"" + name + "\">" + name + "</li>";
    });

    // replace existing container contents

    this.container.innerHTML = HTML;
};
