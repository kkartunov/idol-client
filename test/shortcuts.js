if (typeof window != 'object') {
    // Nodejs
    var CLIENT = require('../lib/idol-client')('someAPIkey'),
        shortcuts = require('../lib/core/shortcuts'),
        assert = require('chai').assert,
        Q = require('q');
} else {
    // Browser
    var CLIENT = IDOLclient('someAPIkey'),
        shortcuts = CLIENT.Methods,
        assert = chai.assert,
        Q = CLIENT.Q;
}

CLIENT.Q.longStackSupport = true;

/*
 * Test test test
 */
describe('IDOLclient shortcuts', function () {

    // No need to repeat dummy tests for all methods
    // as they are created automatically and use same pattern
    // so instead just test a rendom method from the collection.
    var name = CLIENT._.sample(shortcuts);

    describe('IDOLclient.' + name + '(options)', function () {
        it('should be method in the class', function () {
            assert.isFunction(CLIENT[name]);
        });

        it('should throw without options', function () {
            assert.throw(CLIENT[name], 'IDOLclient.' + name + ' requires {} as first argument');
        });

        it('should throw when the API request type is wrong', function () {
            try {
                CLIENT[name]({
                    type: 'not sync or async'
                });
                assert.fail();
            } catch (e) {
                assert.instanceOf(e, Error);
                assert.equal(e.message, 'API request type should be `sync` or `async`');
            }
        });

        it('should not throw when the options is empty {}', function () {
            try {
                CLIENT[name]({});
            } catch (e) {
                assert.fail();
            }
        });
    });

    describe('IDOLclient.jobStatus(jobID)', function () {
        it('should be method in the class', function () {
            assert.isFunction(CLIENT.jobStatus);
        });

        it('should throw without options', function () {
            assert.throw(CLIENT.jobStatus, 'IDOLclient.jobStatus(jobID) requires UUID string as 1st argument');
        });
    });

    describe('IDOLclient.jobResult(jobID)', function () {
        it('should be method in the class', function () {
            assert.isFunction(CLIENT.jobResult);
        });

        it('should throw without options', function () {
            assert.throw(CLIENT.jobResult, 'IDOLclient.jobResult(jobID) requires UUID string as 1st argument');
        });
    });

    describe('IDOLclient.jobAsync(actions, files)', function () {
        it('should be method in the class', function () {
            assert.isFunction(CLIENT.jobAsync);
        });

        it('should throw without options', function () {
            assert.throw(CLIENT.jobAsync, 'IDOLclient.jobAsync(actions, files) requires none empty array with `Actions` as 1st argument');
        });
    });
});
