'use strict';

/*!
 * Module dependencies
 */
var _ = require('lodash'),
    Q = require('q'),
    EventEmitter = require('events').EventEmitter;

module.exports = function createIDOLclient(options) {

    // Create new instance of the class.
    var ins = new IDOLclient(options);

    // Bind all methods to class context.
    _.bindAll(ins);

    // Export external libraries used as they are included
    // in the build anyway. So one can use them too.
    ins._ = _;
    ins.Q = Q;
    ins.superagent = require('superagent');
    // And shortcut names too.
    ins.Methods = require('./core/shortcuts');

    // Return the instance.
    return ins;
};

/**
 * # API
 * This is the `IDOLclient` API reference.
 *
 * ## Constructor
 */
/**
 * Factory/Constructor creating class instances based on `options` parameter. This is what one gets when the lib is required in Node.js or embeded as script in the browser.
 *
 * In case `options` is a **String** then it should be the IDOL API key to use.
 * If you need to alter the default options provide an **Object**. Posible `options` are:
 *
 * - **String** **Required** `APIkey`  IDOL's API key to use
 * - **Object** `APIformat`  Used to build API URLs
 *  - `host`  Defaults to 'api.idolondemand.com'
 *  - `platform`  Defaults to '1'
 * - **Boolean** `autoResult`  Automatically wait for async job result and fire result events. Defaults to `true`.
 * - **Falsey|Int** `requestTimeout`  Reject request promises if not fulfilled or rejected after `requestTimeout`. Defaults to false.
 *
 * Examples:
 *```js
 *  var MyClient = require('idol-client')('MyRegisteredAPIkey');
 *  // or
 *  var MyClient = require('IDOLclient')({
 *      APIkey: 'MyRegisteredAPIkey'
 *  });
 *  // or in the browser
 *  var MyClient = IDOLclient('MyRegisteredAPIkey');
 *  ...
 *```
 * @param {String|Object} options
 * @api public
 */
function IDOLclient(options) {

    // Validate default client options.
    if (options && _.isString(options)) {
        options = {
            APIkey: options
        };
    } else if (!_.isPlainObject(options)) {
        throw new Error('IDOLclient requires constructor options to be set as \'your APIkey\' or {}');
    } else if (!_.has(options, 'APIkey')) {
        throw new Error('IDOLclient needs `APIkey` property to be set');
    }

    // Handle default client options.
    this.options = _.defaults(options, {
        APIformat: {
            host: 'api.idolondemand.com',
            platform: '1'
        },
        autoResult: true,
        requestTimeout: false
    });

    // Add events functionality to the class.
    EventEmitter.call(this);
};
// Add events functionality to the class.
IDOLclient.prototype = Object.create(EventEmitter.prototype);

// Load all class core methods manualy
// as browserify will fail otherwise.
// Not sure!?
// TODO: test fs.readSync if works in the browser?
// probably not...
require('./core/request')(IDOLclient);
require('./core/jobEndpoint')(IDOLclient);


/**
 * ## Properties
 *
 * Because the lib integrates and depands on `lodash`, `Q` and `superagent` those libraries are included into the browser build. Thus it is useful to export and make them available for you. This way your apps using this lib will have `lodash`, `Q` and `superagent` loaded and ready for use. This is very useful in the browser.
 *
 * - `_` Thea famous `lodash` [lodash](https://www.npmjs.org/package/lodash)
 * - `Q` The famous `Q` [q](https://www.npmjs.org/package/q)
 * - `superagent` The famous `superagent` [superagent](https://github.com/visionmedia/superagent)
 * - `Methods` Array of method names which are shortcuts to IDOL API endpoins [APIs](https://www.idolondemand.com/developer/apis)
 *
 * Examples:
 *```js
 *  // in the browser...
 *  var MyClient = IDOLclient('MyRegisteredAPIkey');
 *  var _ = MyClient._;
 *  var Q = MyClient.Q;
 *
 *  _.isElement(document.body)  // => true
 *  Q.isPromise({}) // => false
 *  ...
 *```
 *
 * ## Events
 * IDOLclient's instance is an event aggregator based on node's [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter). One can use it to fire custom events and/or use the predefined ones:
 *
 * - `job result`  Fired when some async job is ready with result.
 * - `job result error`  Fired when some async job errored in waiting for result.
 *
 * Examples:
 *```js
 *  // in the browser...
 *  var MyClient = IDOLclient('MyRegisteredAPIkey');
 *
 *  MyClient.on('job result', function(job){
 *      console.log('Your async job is ready!', job);
 *  });
 *  ...
 *```
 * ## Methods
 * The library currently covers all available IDOL API [endpoints](https://www.idolondemand.com/developer/apis) with theirs parameters. To do so it uses the low level method `request(options)` described bellow. For convinience shortcuts to ease the pain when working with the lib are provided which are defined in the `./lib/core/shrotcuts.js`. They use the `request` method internally. There are currently **43** shortcuts:
 *
 * - recognizeSpeech(options)
 * - connectorStatus(options)
 * - createConnector(options)
 * - deleteConnector(options)
 * - retrieveConfig(options)
 * - startConnector(options)
 * - updateConnector(options)
 * - expandContainer(options)
 * - storeObject(options)
 * - extractText(options)
 * - viewDocument(options)
 * - recognizeBarCodes(options)
 * - detectFaces(options)
 * - recognizeImages(options)
 * - ocrDocument(options)
 * - addToTextIndex(options)
 * - createTextIndex(options)
 * - deleteTextIndex(options)
 * - deleteFromTextIndex(options)
 * - indexStatus(options)
 * - listIndexes(options)
 * - listResources(options)
 * - queryTextIndex(options)
 * - findRelatedConcepts(options)
 * - findSimilar(options)
 * - getContent(options)
 * - getParametricValues(options)
 * - retrieveIndexFields(options)
 * - categorizeDocument(options)
 * - extractEntities(options)
 * - expandTerms(options)
 * - extractConcepts(options)
 * - highlightText(options)
 * - identifyLanguage(options)
 * - analyzeSentiment(options)
 * - tokenizeText(options)
 * - addStore(options)
 * - addUser(options)
 * - authenticate(options)
 * - deleteStore(options)
 * - deleteUser(options)
 * - listStores(options)
 * - listUsers(options)
 *
 * Where `options` is a **Object** with:
 *
 * - **String** `method` The request method. Defaults to `GET`.
 * - **String** `type`  The request type. Can be `sync` or `async`. Defaults to `sync`.
 * - **String** `version`  The API version. Defaults to `v1`.
 * - **Object** `parameters`  Requst query and/or post parameters. The `APIkey` will be included automatically.
 * - **Object** `files`  Collection of files to attach to request. Only for `POST` and `PUT`.
 * - **Object** `headers`  Custom headers to set for the requst.
 * - **HTMLFormElement** `formElm`  Form element to process and attach to request. **Only in the browser**. See [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
 *
 * For example to get the status of one of your indexes you could do:
 *```js
 *  var MyClient = require('idol-client')('MyRegisteredAPIkey');
 *  //or in the browser...
 *  var MyClient = IDOLclient('MyRegisteredAPIkey')
 *
 *  MyClient.indexStatus({
 *      parameters: {
 *          index: 'myIndexName'
 *      }
 *  }).then(
 *      function(res){
 *          console.log(res.code);    // => 200-299
 *          console.log(res.headers);    // => Response headers
 *          console.log(res.data);    // => Response data
 *      },
 *      function(error){ console.log('Ups, some error occured:', error); }
 *  );
 *```
 *
 * More complex example. Lets POST some file for highlighting:
 *```js
 *  var MyClient = require('idol-client')('MyRegisteredAPIkey');
 *  //or in the browser...
 *  var MyClient = IDOLclient('MyRegisteredAPIkey')
 *
 *  // In Node.js...
 *  MyClient.highlightText({
 *      method: 'POST',
 *      parameters: {
 *          file: 'myFileName',
 *          highlight_expression: 'Terms to highlight'
 *      },
 *      files: {
 *          myFileName: __dirname+'/some/path/to/file/fileToAttach.doc' // See IDOL supported files.
 *      }
 *  }).then(
 *      function(res){
 *          console.log(res.code);    // => 200-299
 *          console.log(res.headers);    // => Response headers
 *          console.log(res.data);    // => Response data
 *      },
 *      function(error){ console.log('Ups, some error occured:', error); }
 *  );
 *
 *  // In browser...
 *  MyClient.highlightText({
 *      method: 'POST',
 *      parameters: {
 *          file: 'myFileName',
 *          highlight_expression: 'Terms to highlight'
 *      },
 *      files: {
 *          myFileName: document.getElementById('fileSelect').files[0]  // Should be `File` or `Blob`!
 *      }
 *  }).then(
 *      function(res){
 *          console.log(res.code);    // => 200-299
 *          console.log(res.headers);    // => Response headers
 *          console.log(res.data);    // => Response data
 *      },
 *      function(error){ console.log('Ups, some error occured:', error); }
 *  );
 *```
 *
 * In the example above one should note the difference how files are attached depending on the environment. In general:
 *
 * - **Node.js** - `files` object is key/value pairs of attachment name of the file/path of the file. File will be loaded automatically from the file system.
 * - **Browser** - `files` object is key/value pairs of attachment name of the file/File or Blob objects. If you provide `HTMLFormElement` reference under the `formElm` instead of specifing each file separately in `files` the form will be processed and inputs attached to the request.
 *
 * Additionally there are also the listed methods below...
 */


// Add shortcut for each APIdentifier
require('./core/shortcuts').forEach(function (APIdentifier) {
    IDOLclient.prototype[APIdentifier] = function (options) {
        if (!_.isPlainObject(options))
            throw new Error('IDOLclient.' + APIdentifier + ' requires {} as first argument');
        return this.request(_.extend(options, {
            API: APIdentifier.toLowerCase()
        }));
    };
});
