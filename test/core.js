if (typeof window != 'object') {
    // Nodejs
    var CLIENT = require('../lib/idol-client')('someAPIkey'),
        FACTORY = require('../lib/idol-client'),
        assert = require('chai').assert,
        expect = require('chai').expect,
        Q = require('q');
} else {
    // Browser
    var CLIENT = IDOLclient('someAPIkey'),
        FACTORY = IDOLclient,
        assert = chai.assert,
        expect = chai.expect,
        Q = CLIENT.Q;
}

CLIENT.Q.longStackSupport = true;

/*
 * Test test test
 */
describe('IDOLclient core', function () {

    describe('IDOLclient externals', function () {
        it('should export lodash', function () {
            assert.isFunction(CLIENT._);
            assert.isTrue(CLIENT._.isPlainObject({}), 'should be lodash indeed');
        });

        it('should export Q', function () {
            assert.isFunction(CLIENT.Q);
            assert.isFalse(Q.isPromise(), 'should be Q indeed');
        });

        it('should export superagent', function () {
            assert.isFunction(CLIENT.superagent);
        });
    });

    describe('IDOLclient.request(options)', function () {
        it('should be method in the class', function () {
            assert.isFunction(CLIENT.request);
        });

        it('should throw without options', function () {
            assert.throw(CLIENT.request);
        });

        it('should throw when the APIdentifier is missing', function () {
            try {
                CLIENT.request({});
                assert.fail();
            } catch (e) {
                assert.instanceOf(e, Error);
                assert.equal(e.message, 'IDOLclient.request(options) need API name as option key `API`');
            }
        });

        it('should throw when the API request type is wrong', function () {
            try {
                CLIENT.request({
                    API: 'some API',
                    type: 'not sync or async'
                });
                assert.fail();
            } catch (e) {
                assert.instanceOf(e, Error);
                assert.equal(e.message, 'API request type should be `sync` or `async`');
            }
        });

        it('should always return promise. It will always be rejected on HTTPS connection errors', function (done) {
            var ins = FACTORY({
                APIkey: 'someAPIkey',
                APIformat: {
                    host: 'some-wrong-host.com',
                    platform: '1'
                }
            });
            ins.request({
                API: 'some API',
            }).done(
                assert.fail,
                function (e) {
                    assert.instanceOf(e, Error);
                    done();
                });
        });

        it('should always return promise. It will always be rejected when http response code <200 && >=300 with rsp like object', function (done) {
            var p = CLIENT.request({
                API: 'some API'
            });

            assert.isTrue(Q.isPromise(p));

            p.done(
                assert.fail,
                function (rsp) {
                    assert.isObject(rsp);
                    expect(rsp.code).to.satisfy(function (code) {
                        return code < 200 || code >= 300;
                    });
                    assert.isObject(rsp.headers);
                    assert.isObject(rsp.data);
                    done();
                }
            );
        });
    });
});
