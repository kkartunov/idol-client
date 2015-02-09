# IDOLclient [![Build Status](https://travis-ci.org/ColorfullyMe/idol-client.svg)](https://travis-ci.org/ColorfullyMe/idol-client) [![NPM](https://nodei.co/npm/idol-client.png)](https://nodei.co/npm/idol-client/)

Javascript client for working with the HP's IDOL OnDemand API from Node.js and the browser. Supports all endpoints with theirs parameters, can auto do polling of async tasks, fires events and more...

Made and maintained by <a href="https://github.com/ColorfullyMe" target="_blank">@Colorfully</a> for free. It is open source as software should one day be!:)

**Note** that this work is not oficial HP project!
# Installation
Available as npm package.

`[sudo] npm install idol-client`

Then in **Node.js:**

- `var MyClient = require(idol-client)(options)`

Or in the **browser:**

Include the file `build/idol-client.min.js` to your project. It will always be the latest version. For older ones checkout to previous tags.

- `<script src="build/idol-client.min.js"></script>`

# Contributing
Pull requsts welcome!

Fork. Make changes. Post pull requests...

Uses `gulp` as build tool. Tasks defined:

- `browser-build`  Runs browserify, uglify and etc. Puts result in the `/build` folder.
- `docs`  Creates documentation and this README.
- `APIref`  Parses source via `markdox` to create the API reference.

**Tests** available. Made with `mocha` and `chai`. To execute them:

`[sudo] npm test`

# How to support the project?
> It takes time to do it but saves time using it...

<a href="//gittip.com/ColorfullyMe" target="_blank">Gittip</a>



<!-- Start lib/browser-export.js -->

## IDOLclient

<!-- End lib/browser-export.js -->




<!-- Start lib/idol-client.js -->

# API
This is the `IDOLclient` API reference.

## Constructor

## IDOLclient(options)

Factory/Constructor creating class instances based on `options` parameter. This is what one gets when the lib is required in Node.js or embeded as script in the browser.

In case `options` is a **String** then it should be the IDOL API key to use.
If you need to alter the default options provide an **Object**. Posible `options` are:

- **String** **Required** `APIkey`  IDOL's API key to use
- **Object** `APIformat`  Used to build API URLs
 - `host`  Defaults to 'api.idolondemand.com'
 - `platform`  Defaults to '1'
- **Boolean** `autoResult`  Automatically wait for async job result and fire result events. Defaults to `true`.
- **Falsey|Int** `requestTimeout`  Reject request promises if not fulfilled or rejected after `requestTimeout`. Defaults to false.

Examples:
```js
 var MyClient = require('idol-client')('MyRegisteredAPIkey');
 // or
 var MyClient = require('idol-client')({
     APIkey: 'MyRegisteredAPIkey'
 });
 // or in the browser
 var MyClient = IDOLclient('MyRegisteredAPIkey');
 ...
```

### Params:

* **String|Object** *options* 

## Properties

Because the lib integrates and depands on `lodash`, `Q` and `superagent` those libraries are included into the browser build. Thus it is useful to export and make them available for you. This way your apps using this lib will have `lodash`, `Q` and `superagent` loaded and ready for use. This is very useful in the browser.

- `_` Thea famous `lodash` [lodash](https://www.npmjs.org/package/lodash)
- `Q` The famous `Q` [q](https://www.npmjs.org/package/q)
- `superagent` The famous `superagent` [superagent](https://github.com/visionmedia/superagent)
- `Methods` Array of method names which are shortcuts to IDOL API endpoins [APIs](https://www.idolondemand.com/developer/apis)

Examples:
```js
 // in the browser...
 var MyClient = IDOLclient('MyRegisteredAPIkey');
 var _ = MyClient._;
 var Q = MyClient.Q;

 _.isElement(document.body)  // => true
 Q.isPromise({}) // => false
 ...
```

## Events
IDOLclient's instance is an event aggregator based on node's [EventEmitter](http://nodejs.org/api/events.html#events_class_events_eventemitter). One can use it to fire custom events and/or use the predefined ones:

- `job result`  Fired when some async job is ready with result.
- `job result error`  Fired when some async job errored in waiting for result.

Examples:
```js
 // in the browser...
 var MyClient = IDOLclient('MyRegisteredAPIkey');

 MyClient.on('job result', function(job){
     console.log('Your async job is ready!', job);
 });
 ...
```
## Methods
The library currently covers all available IDOL API [endpoints](https://www.idolondemand.com/developer/apis) with theirs parameters. To do so it uses the low level method `request(options)` described bellow. For convinience shortcuts to ease the pain when working with the lib are provided which are defined in the `./lib/core/shrotcuts.js`. They use the `request` method internally. There are currently **52** shortcuts:

- recognizeSpeech(options)
- connectorStatus(options)
- createConnector(options)
- deleteConnector(options)
- retrieveConfig(options)
- startConnector(options)
- updateConnector(options)
- ...
- and so on.

Where `options` is a **Object** with:

- **String** `method` The request method. Defaults to `GET`.
- **String** `type`  The request type. Can be `sync` or `async`. Defaults to `sync`.
- **String** `version`  The API version. Defaults to `v1`.
- **Object** `parameters`  Requst query and/or post parameters. The `APIkey` will be included automatically.
- **Object** `files`  Collection of files to attach to request. Only for `POST` and `PUT`.
- **Object** `headers`  Custom headers to set for the requst.
- **HTMLFormElement** `formElm`  Form element to process and attach to request. **Only in the browser**. See [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData).

For example to get the status of one of your indexes you could do:
```js
 var MyClient = require('idol-client')('MyRegisteredAPIkey');
 //or in the browser...
 var MyClient = IDOLclient('MyRegisteredAPIkey')

 MyClient.indexStatus({
     parameters: {
         index: 'myIndexName'
     }
 }).then(
     function(res){
         console.log(res.code);    // => 200-299
         console.log(res.headers);    // => Response headers
         console.log(res.data);    // => Response data
     },
     function(error){ console.log('Ups, some error occured:', error); }
 );
```

More complex example. Lets POST some file for highlighting:
```js
 var MyClient = require('idol-client')('MyRegisteredAPIkey');
 //or in the browser...
 var MyClient = IDOLclient('MyRegisteredAPIkey')

 // In Node.js...
 MyClient.highlightText({
     method: 'POST',
     parameters: {
         file: 'myFileName',
         highlight_expression: 'Terms to highlight'
     },
     files: {
         myFileName: __dirname+'/some/path/to/file/fileToAttach.doc' // See IDOL supported files.
     }
 }).then(
     function(res){
         console.log(res.code);    // => 200-299
         console.log(res.headers);    // => Response headers
         console.log(res.data);    // => Response data
     },
     function(error){ console.log('Ups, some error occured:', error); }
 );

 // In browser...
 MyClient.highlightText({
     method: 'POST',
     parameters: {
         file: 'myFileName',
         highlight_expression: 'Terms to highlight'
     },
     files: {
         myFileName: document.getElementById('fileSelect').files[0]  // Should be `File` or `Blob`!
     }
 }).then(
     function(res){
         console.log(res.code);    // => 200-299
         console.log(res.headers);    // => Response headers
         console.log(res.data);    // => Response data
     },
     function(error){ console.log('Ups, some error occured:', error); }
 );
```

In the example above one should note the difference how files are attached depending on the environment. In general:

- **Node.js** - `files` object is key/value pairs of attachment name of the file/path of the file. File will be loaded automatically from the file system.
- **Browser** - `files` object is key/value pairs of attachment name of the file/File or Blob objects. If you provide `HTMLFormElement` reference under the `formElm` instead of specifing each file separately in `files` the form will be processed and inputs attached to the request.

Additionally there are also the listed methods below...

<!-- End lib/idol-client.js -->




<!-- Start lib/core/jobEndpoint.js -->

## jobStatus(jobID)

Retrieve status of a job by UUID.

### Params:

* **String** *jobID* UUID of the job

### Return:

* **Object** Q.promise

## jobResult(jobID)

Waits for job result by UUID.

### Params:

* **String** *jobID* UUID of the job

### Return:

* **Object** Q.promise

## jobAsync(actions, files)

Submit(POST) an asynchronous job to IDOL API for processing.

### Params:

* **Array** *actions* Array of `Action` objects to execute. [See here](https://www.idolondemand.com/developer/docs/AsynchronousAPI.htm)
* **Object** *files* Collection of files to attach to the POST request

### Return:

* **Object** Q.promise

<!-- End lib/core/jobEndpoint.js -->




<!-- Start lib/core/request.js -->

## request(options)

Low level method to make requests to the IDOL API.

### Params:

* **Object** *options* The request options

### Return:

* **Object** Q.promise

<!-- End lib/core/request.js -->




<!-- Start lib/core/shortcuts.js -->

<!-- End lib/core/shortcuts.js -->

