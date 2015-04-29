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

The application is separated in two folders :

 * _/example/resources_ holds the .HTML template and a rudimentary .CSS file
 * _/example/src_ contains all the source JavaScript files. These are separated into _model_, _views_ and _commands_.

The entry point of the application is _bootstrap.js_ from where all dependent files are resolved using CommonJS require statements.

### Application configuration

...all happens in _bootstrap.js_ for simplicity, though you can make this process as complex and modular as you'd like.
The steps taken are:

 * registration of the Models (see _zMVC.registerModel( new PersonModel() )_)
 * binding of the Views with their Controllers (see _zMVC.registerView( ViewReference, ControllerReference )_)
 * binding Commands to specific notification messages (see _ZMVC.registerCommand( notificationId, CommandReference )_)

as the HTML is already present inside the template (see _/example/resources/index.html_), we simply bind their Views
to them and the application can start. The Controllers will monitor the actions taken in the Views and trigger Commands
to bind the application logic together. Have a look in all _/example/src/views/*.controller.js_-files for an in-depth
look, or read on for a step by step explanation.
