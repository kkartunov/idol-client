'use strict';

/*!
 * Module dependencies
 */
var _ = require('lodash'),
    Q = require('q'),
    sagent = require('superagent');


module.exports = function (IDOLclient) {

    /**
     * Low level method to make requests to the IDOL API.
     *
     * @param   {Object}   options The request options
     * @returns {Object} Q.promise
     * @api public
     */
    IDOLclient.prototype.request = function (options) {

        // Handle default API request options.
        options = _.defaults(options, {
            method: 'GET',
            type: 'sync',
            version: 'v1',
            parameters: _.defaults(options.parameters || {}, {
                apikey: this.options.APIkey
            })
        });

        // Validate default API request options.
        // Require the `API` key to be set
        // when path is not defined.
        if (!options.API && !options.path){
            throw new Error('IDOLclient.request(options) need API name as option key `API`');
        }
        if (options.type != 'sync' && options.type != 'async'){
            throw new Error('API request type should be `sync` or `async`');
        }

        // Prepare promise to return.
        var d = Q.defer(),
            self = this,
            REQ;

        // Because of problems with POST/PUT requests in browser env
        // see https://github.com/visionmedia/superagent/issues/501
        // there is need to handle differently according environment.
        // For nodejs env (all type of requests)
        // and any but not POST&PUT in the browser use the `superagent`.
        if (typeof window != 'object' || (options.method != 'POST' && options.method != 'PUT')) {

            REQ = sagent(
                options.method,
                'https://' + this.options.APIformat.host + (options.path || '/' + this.options.APIformat.platform + '/api/' + options.type + '/' + options.API + '/' + options.version)
            );

            // Set headers if provided.
            if (options.headers){
                REQ.set(options.headers);
            }

            if (options.method == 'POST' || options.method == 'PUT') {
                // Handle post &| put requests in nodejs
                // Fields
                _.forEach(options.parameters, function (val, key) {
                    REQ.field(key, _.isString(val) ? val : JSON.stringify(val));
                });
                // Files
                _.forEach(options.files, function (val, key) {
                    REQ.attach(key, val);
                });
            } else {
                // Every other...
                // Parse the query parameter
                REQ.query(options.parameters);
            }

            // Make the request and handle the response.
            REQ
                .end(responseHandler);
        } else {
            // Browser env POST|PUT request,
            // handle it with `FormData` and `XMLHttpRequest` objects.
            REQ = new XMLHttpRequest();
            var FD = new FormData();

            // Allow FormData from HTML element
            if (_.isElement(options.formElm)) {
                FD = new FormData(options.formElm);
            } else {
                // Fields
                _.forEach(options.parameters, function (val, key) {
                    FD.append(key, _.isString(val) ? val : JSON.stringify(val));
                });
                // Files
                _.forEach(options.files, function (val, key) {
                    FD.append(key, val);
                });
            }

            // Make the request and handle the response.
            REQ.open(
                options.method,
                'https://' + this.options.APIformat.host + (options.path || '/' + this.options.APIformat.platform + '/api/' + options.type + '/' + options.API + '/' + options.version)
            );
            // Set custom headers.
            _.forEach(options.headers, function (val, key) {
                REQ.setRequestHeader(key, val);
            });
            REQ.onreadystatechange = function () {
                try {
                    if (REQ.readyState === 4) {
                        responseHandler(null, {
                            status: REQ.status,
                            headers: (function () {
                                // Inspired by
                                // https://gist.github.com/monsur/706839
                                var headers = {},
                                    headerStr = REQ.getAllResponseHeaders(),
                                    headerPairs = headerStr.split('\u000d\u000a');

                                for (var i = 0; i < headerPairs.length; i++) {
                                    var headerPair = headerPairs[i];
                                    // Can't use split() here because it does the wrong thing
                                    // if the header value has the string ": " in it.
                                    var index = headerPair.indexOf('\u003a\u0020');
                                    if (index > 0) {
                                        var key = headerPair.substring(0, index);
                                        var val = headerPair.substring(index + 2);
                                        headers[key] = val;
                                    }
                                }
                                return headers;
                            })(),
                            body: (function () {
                                if (REQ.getResponseHeader('Content-Type') == 'application/json; charset=utf-8'){
                                    return JSON.parse(REQ.responseText);
                                }
                                return REQ.responseText;
                            })()
                        });
                    }
                } catch (e) {
                    responseHandler(e);
                }
            };
            REQ.ontimeout = function () {
                responseHandler(new Error('XMLHttpRequest timeout'));
            };
            REQ.send(FD);
        }

        // Response handler
        function responseHandler(err, res) {
            //console.log('resp', err, res.status);
            // Handle connection HTTPS errors.
            if (err){
                d.reject(err);
            }else {
                var answer = {
                    code: res.status,
                    headers: res.headers,
                    data: res.body
                };

                // Check if response is IDOL API error or not
                if (res.status < 200 || res.status >= 300) {
                    // YES it is error.
                    // Resolve the promise with the error.
                    d.reject(answer);
                } else {
                    // NO it is not error.
                    // Queue the job for polling if it is async job.
                    if (options.type == 'async' && Boolean(self.options.autoResult)) {
                        self
                            .jobResult(res.body.jobID)
                            .done(
                                _.partial(self.emit, 'job result'),
                                _.partial(self.emit, 'job result error')
                        );
                    }
                    // Resolve the promise with the result.
                    d.resolve(answer);
                }
            }
        }

        // Exit with with the promise.
        return parseInt(this.options.requestTimeout) ? d.promise.timeout(parseInt(this.options.requestTimeout)) : d.promise;
    };
};
