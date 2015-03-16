# zMVC is...
a lightweight JavaScript framework separating data and presentation using the Model, View, Controller-pattern, while
additionally providing a messaging system allowing you to run synchronous commands tying all the tiers together to
form an application.

zMVC takes inspiration from puremvc.org, but removes some restrictions and simplifies the command pattern.

In zMVC, the Models and Controllers should be as "dumb" as possible, they should simply act as the middleman (in the
Models case: for its data, in the Controllers case for its View), and broadcast changes via messages.

Your _actual application_ should be Command-based. Commands are short functions that grab the zMVC actors they
need to fulfill their role and update their status to match the new application state. Those of a Agile Methodology-bent
can think of a Command as a user story (see more of this below under 'zMVC actors - Command / MacroCommand').

# Publish - subscribe pattern

The actors _Command_, _Model_ and _Controller_ can send messages over the framework. A message consists of a _type_ (a
unique String identifier) and contains an optional data Object (can be any kind of Object). _Controllers_ can subscribe
to handle any kind of message type, while a _Command_ can be registered to be launched whenever a specific message type
is broadcast.

The basic interface to broadcast messages is :

    (this.)broadcast( aMessageType, aOptionalMessageData );

Which broadcasts a message with type of given (String) aMessageType, with optional (*) aMessageData as the payload.

# Requirements

zMVC can be used in node.js / CommonJS projects. Using a tool like Browserify allows you to build the framework for
use in the webbrowser.

zMVC is built on top of zjslib, but should you choose not to use zjslib components yourself, this shouldn't interfere
nor dictate your workflow. zMVC is very simple and written in ES5, working on anything from IE9 onwards out of the box.
You can also integrate zMVC easily in ES6 modules should you choose to.

# Installation

You can get zMVC via NPM :

    npm install zmvc

# zMVC actors

Here the actors of the framework are explained.

## MVC

The core framework actor. Your code should never interact with the core, apart from the _setup stage_. While MVC is
responsible for broadcasting messages to subscribed components, you'd never invoke these _directly_, as these actions
will be instructed by your setup.

Its "public" methods are:

    MVC.registerView( aView, aController );

Registers a (View-prototype) aView to a (Controller-prototype) aController. Controllers are always _unique_ and can
only control a _specific_ View. When a new instance of the given View prototype is added to the frameworks Stage (let's
say your document.body) its associated Controller will be fetched, constructed and attached to the View.

    MVC.unregisterView( aView );

Unregisters given (View-prototype) aView from the framework. New instances of this View will not be bound to a Controller.

    MVC.registerModel( aModel );

Registers given (Model-instance) aModel in the framework. A model is _always unique_ and should only have a single
instance. Note that the model is now referenced inside the framework, overcoming the need to keep its reference elsewhere.

    MVC.unregisterModel( aModel );

Unregisters given (Model-instance) aModel from the framework. The Model will now go out of the frameworks scope (and
can be garbage collected if no other references remain). It is unlikely you will need to unregister Models during your
applications lifetime, but you're the boss!

    MVC.getModel( aModelName );

Retrieve the registered instance of the model with given (String) aModelName as its name (see _Model_ on name
identifiers).

    MVC.registerCommand( aMessageType, aCommandRef );

Register given (Command-prototype) aCommandRef to be launched whenever (String) aMessageType is broadcast over
the framework.

    MVC.unregisterCommand( aMessageType );

Unregisters the Command-prototype that was previously registered to given (String) aMessageType.

    MVC.broadcast( aMessageType, aMessageData );

Broadcast a message with type of given (String) aMessageType, with optional (*) aMessageData as the payload. You will
likely use the method of the same name inside _Commmands_, _Models_ and _Controllers_ to broadcast messages.

## Model

The data layer. A model can simply hold collections of data, or can be made intelligent (for instance: to perform actions
when data changes) as you please. A Model should have a _unique NAME identifier_ so it can be retrieved from the
framework.

Its constructor :

    Model( aName );

Which creates a new instance of the Model, and registers it into the framework under given (String) aName as its identifier;

Its "public methods" are :

    getName();

Returns unique (String) NAME identifier.

    broadcast( aMessageType, aMessageData );

Its interface to broadcast messages.

## View

The presentation layer. The View has no access to the framework in the sense that it _cannot broadcast messages_. Instead the Views link
to the framework comes in the form of its _Controller_. (see _Controller_ on how to interact with the View). Just like a _Model_ the View
needs a _unique NAME identifier_ which allows it to be linked to a Controller. This identifier must be present on the Views Function directly,
and _not on its prototype_, like so:

    View.NAME = "aUniqueViewIdentifier";

Constructing a View:

    View( aElement );

Where aElement is either a (Element) reference to an existing tag in the HTML document, or a (String) tagName. When tagName,
a new Element of given tagName will be created and can be added to the DOM by using the "_addChild()_"-interface of the Sprite (see zjslib).
When using the Sprite pattern to create Views, the Views Controller will only be attached after it becomes visible in the application (see
zjslib "_addChild()_", "_removeChild()_".

If you are not interested in using zjslib's Sprite construction, simply pass in a reference to an existing HTML element that should be
part of a View - Controller pairing to interact with the framework.

Instance properties :

    View.prototype.controller;

A reference to the Views _Controller_.

## Controller

The Controller is the middleman between a _View_ and the framework. A Controllers prototype is paired with a specific Views
prototype (see _MVC.registerView_) during the application setup phase. When an instance of its associated View is constructed and
added to the DOM, the Controller will be instantiated and linked to the View.

A controller can broadcast messages, subscribe to listen to certain messages (following the "Mediator"-construct of PureMVC) and
can additionally request access to a Model.

View - Controller communication can be done using the following constructs :

 * the Controller directly adds handlers to the Views components (the Controller has full access to the View, and a Controller
   should be _unique_ to its Views type, as such it may know about the Views properties).
 * the View dispatches Events to the Controller (also see zjslib _EventDispatcher_). This has the benefit that you can use abstract
   messages to inform the Controller of changes, if you feel the Controller shouldn't know about the Views presentation-related
   properties (e.g. listen to disptach of "LOGIN_CLICKED" instead of this.view.getLoginButton().addEventListener( "click" )...

The "public" methods of a Controller :

    init();
    
Invoked automatically whenever the framework creates a new instance of the Controller (when its associated View is added to
the applications HTML document). This method will invoke the _subscribe()_- and _onInit_()-methods (see below). It is recommended
not to override this method in your inheriting prototypes, but override _onInit()_ instead.

    dispose();
    
Invoked automatically whenever the associated View is removed from the applications HTML document. This method will unregister
the messages the Controller subscribed to and subsequently invoke _onDispose()_ (see below). It is recommended not to override
this method in your inheriting prototypes, but override _onDispose()_ instead.

    subscribe();
    
Invoked by the the _init()_-method described above. This method should be overridden in your derived class to return an
Array of Strings. These Strings correspond to unique message type identifiers. This Array basically instructs the framework
that the Controller is interested to be notified whenever a message of given type is being broadcast.

    onMessage( aMessageType, aMessageData );

Invoked whenever the framework broadcasts a message the Controller has subscribed itself to listen to (see _subscribe()_).
(String) aMessageType is the unique identifier of the message that has been broadcast, while (*) aMessageData is optional, and
can contain the message payload.

This function should be overridden in your derived classes, like so :

    ControllerExtension.prototype.onMessage = function( aMessageType, aMessageData )
    {
        switch ( aMessageType )
        {
            case "LOGIN_SUCCESS":
                // aMessageData could be a JSON Object holding profile information
                this.view.showProfile( aMessageData );
                break;

            case "LOGIN_FAILURE":
                // aMessageData could be JSON Object holding error messages
                this.view.showError( aMessageData );
                break;
        }
    }

    getModel( aModelName );

Retrieve a model registered under given (String) aModelName from the framework.

    onInit();

Invoked by the _init()_-method when the Controller is constructed and linked to a View. You can override this method to execute
custom code whenever your custom Controller initializes.

    onDispose();

Invoked by the _dispose()_-method when the Controller is unlinked from its View and will be disposed. You can override this
method to execute custom clean up code whenever your custom Controller is disposed.

    broadcast( aMessageType, aMessageData );

Its interface to broadcast messages.

Instance properties :

    Controller.prototype.view;

A reference to the Controllers _View_.

# zMVC Commands

Where things get interesting. A Command is basically a short function that takes whatever it needs from different parts of
the framework to complete _a single purpose_. You can also _nest individual Commands as part of a larger chain_ to complete
a more complex set of operations. For instance you can have a command chain that should culminate in the user being logged in.
Individual Commands of this chain could be :

    "validate login form data"
    "check internet connection"
    "send login data to server"
    "validate server response"
    "on login failure : show error on screen" / "on login success : replace login form with profile data on screen"

You may notice this kind of reads like a user story, making your applications logic understandable in bitesize snippets. Why, you
can even reuse the "check internet connection"-Command as part of other command chains, should you choose to.

Commands aren't constructed directly. Instead, during the _setup phase_ a unique message type is associated with a Command
prototype. For instance when message "LOGIN" is broadcast, the associated "LoginCommand" will be constructed and executed (see
"_MVC.registerCommand_")

A Command is "alive" until it has called its complete handler (see below). When a Command completes, its reference is removed
from the framework and can be garbage collected. When Commands are executed as part of a MacroCommand (that is a chain of
commands), each subsequent command will only be executed when the previous command has called its complete handler. Once
all sub commands have completed, the parent MacroCommand will complete and unregister itself from the framework.

A Command can broadcast messages and can request access to a Model.

## Command

The public methods of a Command are:

    execute( aMessageType, aMessageData );

Invoked whenever the framework has launched the Command registered to message type of given (String) aMessageType. (*) aMessageData
contains the optional message payload (for instance a data structure). Override this function in your derived Commands. Keep in mind
the command will not complete when this function body exists, you must explicitly call _commandComplete()_ (see below).

    done();

To be invoked by the Command whenever its operations have completed successfully. If the Command is part of a MacroCommand, this
will inform the MacroCommand that the next queued Command in the chain can be executed.

    cancel();

To be invoked whenever the Command cannot complete its operations successfully (for instance: data is invalid, could not
connect to a remote server, etc.). If the Command is part of a MacroCommand, this will also _cancel the execution of the remaining
subcommands_ (for instance in above example it makes no sense to send login data to a server if there is no internet connection).

    getModel( aModelName );

Retrieve a model registered under given (String) aModelName from the framework.

    broadcast( aMessageType, aMessageData );

The interface to broadcast messages.

## MacroCommand

A MacroCommand is treated by the framework like any other Command (as in : it is constructed and launched whenever its
associated message type is broadcast). Internally however, the MacroCommand manages a chain of individual Commands. These
Commands are executed in order _when the previous Command has finished its execution_. When the subcommands execute, they
will receive _the same message type and (optional) message playload Object_ that was broadcast when the MacroCommand was launched.

Custom MacroCommands should do nothing more than create a list of Commands to be executed.

The "public methods" of a MacroCommand :

    init();

To be overridden in derived MacroCommands. Here you can create a list of Commands to execute by using the _addSubCommand()_-method (see below).

    addSubCommand( aCommandRef );

Adds given (Command-prototype) aCommandRef to the internal chain. When the MacroCommand is executed, it will construct and execute
given Command in the order of addition.

Using this construct, you can recreate above example like so :

    module.exports = CustomMacroCommand;

    MacroCommand.extend( CustomMacroCommand, require( "zmvc" ).MacroCommand ));

    CustomMacroCommand.prototype.init = function()
    {
        this.addSubCommand( require( "./ValidateLoginDataCommand" ));
        this.addSubCommand( require( "./CheckInternetConnectionCommand" ));
        this.addSubCommand( require( "./RequestRemoteLoginCommand" ));
        this.addSubCommand( require( "./ValidateLoginResponse" ));
    };

If any of these sub commands are cancelled (for instance login data is invalid, no internet connection is present or the
remote reponse has failed validation), the subsequent pending commands are not executed. Be sure to broadcast messages
from the individual commands to update the UI with the errors.

## Extending the base actors

The _Model_, _View_, _Controller_, _Command_ and _MacroCommand_ actors of zMVC provide a convenient interfaces to
extend their prototypes. This is done using their "_extend()_"-methods. An example to quickly create a new Model "class" :

    module.exports = CustomModel;

    var Model = require( "zmvc" ).Model;

    function CustomModel()
    {
        this._name = CustomModel.NAME;
    }
    Model.extend( CustomModel, Model );

    CustomModel.NAME = "UniqueIdentifierForCustomModel";
