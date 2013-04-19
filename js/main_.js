/**
 * This file is the application's main JavaScript file. It is listed as a dependency in run.js and will automatically
 * load when run.js loads.
 *
 * Because this file has the special filename `main.js`, and because we've registered the `app` package in run.js,
 * whatever object this module returns can be loaded by other files simply by requiring `app` (instead of `app/main`).
 *
 * Our first dependency is to the `dojo/has` module, which allows us to conditionally execute code based on
 * configuration settings or environmental information. Unlike a normal conditional, these branches can be compiled
 * away by the build system; see `staticHasFeatures` in app.profile.js for more information.
 *
 * Our second dependency is to the special module `require`; this allows us to make additional require calls using
 * module IDs relative to this module within the body of the define callback.
 *
 * In all cases, whatever function is passed to define() is only invoked once, and the returned value is cached.
 *
 * More information about everything described about the loader throughout this file can be found at
 * <http://dojotoolkit.org/reference-guide/loader/amd.html>.
 */
define([ 'dojo/has', 'require' ], function (has, require) {
	var app = {};

	require([ './Dialog', 'dojo/domReady!' ], function (Dialog) {
			app.dialog = new Dialog().placeAt(document.body);

			// It is important to remember to always call startup on widgets after you have added them to the DOM.
			// It will not hurt if you do it twice, but things will often not work right if you forget to do it.
			app.dialog.startup();

			// And now we just show the dialog to demonstrate that, yes, the example app has loaded successfully.
			app.dialog.show();
		});
	}
	else {
		// TODO: Eventually, the Boilerplate will actually have a useful server implementation here :)
		console.log('Hello from the server!');
	}
});
