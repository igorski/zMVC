zMVC example
============

This example should illustrate how to quickly create an application using zMVC. While it might seem unnecessary to perform
some of the steps documented in this example, it should at least point out how one can quickly sketch an application that
is maintainable and can be built upon.

## Running the example

First resolve all the dependencies using NPM :

    npm install

Then run the following Grunt task:

    grunt start

this task will launch a browser which will preview the application. You can also adjust the sources and monitor the changes
in realtime as the task synchronizes a file watcher with the browser.

## Basic application outline

The example application is very simple :

the application is a "people manager" and consists of :

 * a form where the user can add a new person (by entering a unique name)
 * a window displaying all the registered persons
 * a feedback window to display messages / warnings / errors

by clicking on a person inside the list, the person is removed from the model/list. Actions trigger a feedback
message in the bottom window and validation errors (e.g. entering the same name twice, submitting the form without
a value) are displayed in the same window. Excitement galore!

In order to realise this vision, you would need the following :

 * a Model (PersonModel) to store all the data (e.g. the persons)
 * three Views to represent the UI components mentioned above
 * three Controllers to monitor the actions taken by aforementioned Views
 * Commands, triggered by the Controllers to take application related actions

## Application structure

The application is separated into two folders :

 * _/example/resources_ holds the .HTML template and a rudimentary .CSS file
 * _/example/src_ contains all the source JavaScript files. These are separated into _model_, _views_ and _commands_.

The entry point of the application is _bootstrap.js_ from where all dependent files are resolved using CommonJS require statements.

### Application configuration

...all happens in _bootstrap.js_ for simplicity, though you can make this process as complex and modular as you'd like.
The steps taken are:

 * registration of the Models (see _zMVC.registerModel( new PersonModel() )_)
 * binding of the Views with their Controllers (see _zMVC.registerView( ViewReference, ControllerReference )_)
 * binding Commands to specific notification messages (see _zMVC.registerCommand( notificationId, CommandReference )_)

The Commands are basically what make _the application work to fulfill its purpose_. Views and Controllers basically do
_one single thing_ and should _not know how they relate to other components_. By broadcasting messages and subscribing to
messages, simple actions can trigger a larger chain of reactions, each of these having the benefit that they can be
managed on a micro level. As such, you will likely have a file that acts as an enumeration, showcasing all possible
actions to be taken by your application, ours is in _/example/src/definitions/Notifications.js_ :

    module.exports =
    {
        ADD_PERSON    : "NN::01",   // basically a unique String value for each key
        REMOVE_PERSON : "NN::02",
        MODEL_UPDATED : "NR::01",
        ERROR         : "NE::01",
        FEEDBACK      : "NE::02"
    };

As you can see, you can make the keys as descriptive as you'd like. A notification is simply a String message that can
be broadcast to listening actors of the framework (_Controllers_). Alternatively a notification can be mapped to a Command
(via _zMVC.registerCommand()_), meaning that it will launch the associated command _whenever this notification is broadcast_
by any of the framework actors (_Controller_, _Model_ or _Command_).

As the HTML markup is already present inside the template (see _/example/resources/index.html_), we simply bind the Views
to the markup and the application can start. The Controllers will monitor the actions taken inside the Views and trigger the
Commands that bind the application logic together.

Have a look in all _/example/src/views/*.controller.js_-files for an in-depth look, or read on for a step by step explanation.

## Application source code

Here we explain all individual components necessary to realize above application. When in doubt about the zMVC API, consult
the _README.md_-file inside the repository's root.

### 1. The Model

This application has a single model named PersonModel (_/example/src/models/PersonModel_) which will hold all
registered persons. The basic setup for creating this new Model is as simple as the following snippet:

    var Model = require( "zMVC" ).Model;

    module.exports = PersonModel;

    function PersonModel()      // declaration of the new Model
    {
        Model.base( this, PersonModel.NAME );
        this._persons = [];     // just an Array of String names
    }
    Model.extend( PersonModel, Model ); // inherit from the Model prototype

    /* class properties / methods */

    PersonModel.NAME = "PersonModel";

Two things of note here :

1. _PersonModel.NAME_ which is the unique identifier for this Model. This identifier is used by the other actors
of the framework (e.g. _Controller_ and _Command_) to retrieve a reference to this PersonModel-instance. We'll see
later on what this means ;)

2. _PersonModel.prototype._persons_ which we declared inside the constructor. As mentioned before, a Person isn't any
more complex than a simple name. As such _persons_ is an Array that will hold String values. You can of course use
Objects or Function instances for your own custom models.

Our application is very simple, as such we add three methods to make the Model "intelligent", we'd like to be able
to:

 * retrieve all registered persons (_getPersons()_)
 * add a new person (_storePerson( name )_)
 * remove a person (_removePerson( name )_)
 * query whether a person has been registered (_hasPerson( name )_)

Also note that in the source code, the Model broadcasts a message whenever its contents are _mutated_ (e.g. change
when a new person is added, or an existing person is removed) :

    this.broadcast( Notifications.PERSON_MODEL_UPDATED );

We'll see later on how our application can benefit from a Model that can broadcast its own state changes.

### 2. The Views

As stated in the application outline, we will need three views :

 * Form (_/example/src/views/Form.view.js_ bound to _/example/src/views/Form.controller.js_)
 * Person (_/example/src/views/Person.view.js_ bound to _/example/src/views/Person.controller.js_)
 * Message (_/example/src/views/Message.view.js_ bound to _/example/src/views/Message.controller.js_)

#### FormView / FormController :

The FormView is very simple, it retrieves a reference to the input field and submit button present inside the
template (see _FormView.prototype.init()_).

The FormController is equally simple, it has a basic listener :

    FormController.prototype.onInit = function()
    {
        this.view.submitButton.addEventListener( "click", function( e )
        {
            e.preventDefault();                     // prevent page refresh
            var value = this.view.inputField.value; // get input field value

            this.broadcast( Notifications.ADD_PERSON, value );

        }.bind( this ));
    };

which basically grabs a reference to the _submitButton_ present inside the view and attaches a listener that fires
whenver the button is clicked. When the button is clicked, the controller retrieves the current value of the inputField
and broadcasts a message stating a person should be added. As the messages payload/data the value is transferred along.

Note that that is all there is to it. The FormController isn't bothered by what happens to the data it transfers. It
doesn't perform validations, nor does it talk to the PersonModel.

#### PersonView / PersonController :

Just like Form, the PersonView grabs a reference to its elements inside its HTML template, which in PersonViews case
is just a container. Additionally, the PersonView has a method "showPersons" which can take an Array of Strings and
output it as HTML list items inside its container.

The PersonController has slightly more logic than the FormController, in that it is interested in being notified
whenever a specific notification message is broadcast over the framework :

    PersonController.prototype.subscribe = function()
    {
        return [ Notifications.PERSON_MODEL_UPDATED ];
    };

The above is the PersonController informing the framework that it would like to be notified whenever the
notification message _PERSON_MODEL_UPDATED_ has been broadcast.

The following method:

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

is the handler that will evaluate all notifications that are broadcast to the Controller. The switch statement
evaluates the message type, in the above snippet the PersonController invokes the views "_showPersons( list )_"-method
to render the current contents of the PersonModel.

Additionally, the PersonController also listens to the view for click events. Whenever the view is clicked, the underlying
person should be removed from the Model :

    PersonController.prototype.onInit = function()
    {
        // when the views container is clicked, remove the associated person from the model
        this.view.container.addEventListener( "click", function( e )
        {
            var personId = e.target.dataset.id; // retrieve person identifier from data attribute

            if ( personId ) {
                this.broadcast( Notifications.REMOVE_PERSON, personId );
            }

        }.bind( this ));
    };


#### MessageView / MessageController

The MessageView is once more very spartan in its code. It has a single method "_showMessage( message, isError )_" that
can be invoked to add a string message inside its container.

The MessageController is interested in being notified whenever the following messages are broadcast:

    MessageController.prototype.subscribe = function()
    {
        return [
            Notifications.ERROR,
            Notifications.FEEDBACK
        ];
    };

in other words, whenever an ERROR or FEEDBACK message is broadcast, which it handles like so :

    MessageController.prototype.onMessage = function( aMessageType, aMessageData )
    {
        switch ( aMessageType )
        {
            case Notifications.ERROR:
                // message data holds String message text
                this.view.showMessage( aMessageData, true );
                break;

            case Notifications.FEEDBACK:
                // message data holds String message text
                this.view.showMessage( aMessageData, false );
                break;
        }
    };

as you can see, the MessageController is unaware of what the triggers for the messages were, as such it has _no context_.
It only tells the view to display the message, and instructs it whether the message is an error (leading the MessageView
to render the text red, 'cause it's nice and scary).

### 3. The Commands

There are two commands for this application, namely _AddPersonCommand_ and _RemovePersonCommand_ (_/example/src/commands_).

#### AddPersonCommand

As visible in _bootstrap.js_, AddPersonCommand is registered to be launched whenever _Notifications.ADD_PERSON_ is broadcast
over the framework. We have seen in _FormController_ that this message is broadcast along with a String name as its
payload. The basic command looks like this :

    AddPersonCommand.prototype.execute = function( aMessageType, aMessageData )
    {
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
        this.done(); // command is synchronous, invoke complete handler immediately
    };

as you can see, the command validates the messages payload data to see if it matches expectations (not very
interesting, initially it should be a String of at least one character in length). When it passes this
validation, the command checks whether the Model already has a Person registered under this name. If not, the
person is added and a FEEDBACK message is broadcast. If the person was registered previously, or the message data
didn't pass the validation, an ERROR message is broadcast.

As we have seen in the _MessageController_ the ERROR and FEEDBACK messages are captured their, so the messages can
be displayed inside the _MessageView_. If you look into the _PersonModel_-code you can see that upon adding a new
person using "_storePerson( name )_" a notification message _PERSON_MODEL_UPDATED_ is broadcast, which is captured
by the _PersonController_ so the updated PersonModel contents can be reflected inside the _PersonView_.

#### RemovePersonCommand

    RemovePersonCommand.prototype.execute = function( aMessageType, aMessageData )
    {
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
        this.done(); // command is synchronous, invoke complete handler immediately
    };

Similarly to the _AddPersonCommand_ the RemovePersonCommand validates the message data (the unique identifier / name
of the Person to delete), checks whether the _PersonModel_ actually contains a person with this name and takes
action accordingly, broadcasting feedback or error message requests as applicable.

### Conclusion

As you can see, the Commands are unaware of the Views forms or the Controllers triggering them. They basically perform a
single operation and broadcast notification messages that describe the operations outcome.

The same should apply to Controllers and Views, they can expect _input_ and can _output_ messages. This makes zMVC
applications easily unit testable as all the actors can perform their operations in isolation.
