var MVC = require( "zMVC" ).MVC;

var FormView          = require( "./views/Form.view" );
var FormController    = require( "./views/Form.controller" );
var PersonView        = require( "./views/Person.view" );
var PersonController  = require( "./views/Person.controller" );
var MessageView       = require( "./views/Message.view" );
var MessageController = require( "./views/Message.controller" );
var PersonModel       = require( "./model/PersonModel" );
var Notifications     = require( "./definitions/Notifications" );

// 1. configure the framework

MVC.registerModel  ( new PersonModel() );
MVC.registerCommand( Notifications.ADD_PERSON,    require( "./commands/AddPersonCommand" ));
MVC.registerCommand( Notifications.REMOVE_PERSON, require( "./commands/RemovePersonCommand" ));
MVC.registerView   ( FormView,    FormController );
MVC.registerView   ( PersonView,  PersonController );
MVC.registerView   ( MessageView, MessageController );

// 2. bind the Views inside the DOM to their View/Controller pairs

new FormView   ( document.getElementById( "form" ));
new PersonView ( document.getElementById( "persons" ));
new MessageView( document.getElementById( "messages" ));

// all done, have a look at the View/Controller pairs to see how they might
// influence the launching of commands to alter the state of the application
// all interactions are triggered from the Controllers listening to changes from their View!
