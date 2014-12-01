// Those tests require IDOL API key to run with.
// Try to load it from .env file...
require('dotenv').load();
if (!process.env.IDOL_API_KEY)
    return; // No key no tests.

// Create a client instance to use.
var MyClient = require('../lib/idol-client.js')(process.env.IDOL_API_KEY),
    assert = require('chai').assert;

MyClient.Q.longStackSupport = true;


describe('Async request[s]', function () {

    it('resolve with the `jobID`, trigger `job result` event when job result available but only when `autoResult` is truthy', function (done) {
        // Send some async job
        // if `autoResult` is truthy events will fire
        // when result is available|errored.
        MyClient.highlightText({
            type: 'async',
            parameters: {
                text: 'some test text to highlight',
                highlight_expression: 'test'
            }
        }).done(
            function (r) {
                assert.isObject(r);
                assert.isObject(r.data);
                assert.isString(r.data.jobID);
                // If `autoResult` is falsy no `job result` events are fired
                // thus exit here.
                if (!MyClient.options.autoResult)
                    done();
                //console.log(r);
            },
            assert.fail
        );

        MyClient.on('job result', function (res) {
            //console.log(res);
            assert.isObject(res);
            assert.isObject(res.headers);
            assert.isNumber(res.code);
            assert.property(res.data, 'status');
            assert.property(res.data, 'jobID');
            assert.property(res.data, 'actions');
            assert.isString(res.data.status);
            assert.isString(res.data.jobID);
            assert.isArray(res.data.actions);
            done();
        });

        MyClient.on('job result error', assert.fail);
    });

    it('can be processed via Q easily too', function (done) {
        // Send some async job
        // process it via promise resolution and chaining.
        var checkID;
        MyClient.jobAsync([{
            name: 'highlight',
            version: 'v1',
            params: {
                file: 'myfile',
                highlight_expression: 'test'
            }
        }], {
            myfile: __dirname + '/test.doc'
        })
            .get('data')
            .get('jobID')
            .tap(function (theID) {
                checkID = theID;
            })
            .then(MyClient.jobResult)
            .get('data')
            .done(function (jobresult) {
                assert.isString(jobresult.status);
                assert.equal(jobresult.status, 'finished');
                assert.isString(jobresult.jobID);
                assert.isArray(jobresult.actions);
                assert.equal(jobresult.jobID, checkID);
                done();
            }, assert.fail);
    });
});

describe('Sync request[s]', function () {
    it('resolve with the result in the promise', function (done) {
        MyClient.highlightText({
            parameters: {
                text: 'some test text to highlight',
                highlight_expression: 'test'
            }
        })
            .get('data')
            .get('text')
            .done(
                function (text) {
                    assert.equal(text, 'some <span style="background-color: yellow">test</span> text to highlight');
                    done();
                },
                assert.fail
        );
    });
});
