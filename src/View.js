/**
 * Created by igorzinken on 19-02-15.
 */
module.exports = View;

var Inheritance = require( "zjslib" ).Inheritance;
var Sprite      = require( "zjslib" ).Sprite;
var MVC         = require( "./MVC" );

/**
 * @constructor
 * @extends {Sprite}
 *
 * @param {string|Element} aElement
 */
function View( aElement )
{
    Inheritance.super( this, aElement );

    // in case given Element is already present in the DOM, fire
    // the onAddedToStage handler to bind the View to its Controller instantly

    if ( this._element.parentNode ) {
        this.onAddedToStage();
    }
}

Inheritance.extend( View, Sprite );

/* static properties */

/**
 * a View identifies itself by its NAME, which should
 * be unique for each View - Controller pairing
 *
 * @public
 * @const
 * @type {string}
 */
View.NAME = "View";

/* class properties */

/** @public @type {Controller} */ View.prototype.controller;

/* public methods */

/**
 * invoked after this Sprite has been added to the Display List
 *
 * @override
 * @public
 */
View.prototype.onAddedToStage = function()
{
    Inheritance.super( this, "onAddedToStage" );
    MVC.bindView( this );
};

/**
 * invoked after this Sprite has been removed from the Display List
 *
 * @override
 * @public
 */
View.prototype.onRemovedFromStage = function()
{
    Inheritance.super( this, "onRemovedFromStage" );
    MVC.unbindView( this );
};
