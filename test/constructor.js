if (typeof window != 'object') {
    // Nodejs
    var IDOLclient = require('../lib/idol-client'),
        assert = require('chai').assert;
} else {
    // Browser
    var assert = chai.assert;
}

/*
 * Test test test
 */
describe('IDOLclient constructor', function () {
    it('should be constructor', function () {
        var a = IDOLclient('A'),
            b = IDOLclient('B');

        assert.propertyVal(a.options, 'APIkey', 'A');
        assert.propertyVal(b.options, 'APIkey', 'B');
    });

    it('should throw without options', function () {
        assert.throw(IDOLclient, Error, 'IDOLclient requires constructor options to be set as \'your APIkey\' or {}');
    });

    it('should throw with empty string as options', function () {
        try {
            IDOLclient('');
            assert.fail('should throw');
        } catch (e) {
            assert.instanceOf(e, Error);
            assert.equal(e.message, 'IDOLclient requires constructor options to be set as \'your APIkey\' or {}');
        }
    });

    it('should throw with function as options', function () {
        try {
            IDOLclient(function () {});
            assert.fail('should throw');
        } catch (e) {
            assert.instanceOf(e, Error);
            assert.equal(e.message, 'IDOLclient requires constructor options to be set as \'your APIkey\' or {}');
        }
    });

    it('should throw with array as options', function () {
        try {
            IDOLclient([]);
            assert.fail('should throw');
        } catch (e) {
            assert.instanceOf(e, Error);
            assert.equal(e.message, 'IDOLclient requires constructor options to be set as \'your APIkey\' or {}');
        }
    });

    it('should throw with number as options', function () {
        try {
            IDOLclient(1234);
            assert.fail('should throw');
        } catch (e) {
            assert.instanceOf(e, Error);
            assert.equal(e.message, 'IDOLclient requires constructor options to be set as \'your APIkey\' or {}');
        }
    });

    it('should throw with bool as options', function () {
        try {
            IDOLclient(true);
            assert.fail('should throw');
        } catch (e) {
            assert.instanceOf(e, Error);
            assert.equal(e.message, 'IDOLclient requires constructor options to be set as \'your APIkey\' or {}');
        }
    });

    it('should throw with empty object as options', function () {
        try {
            IDOLclient({});
            assert.fail('should throw');
        } catch (e) {
            assert.instanceOf(e, Error);
            assert.equal(e.message, 'IDOLclient needs `APIkey` property to be set');
        }
    });

    it('should accept object with `APIkey` propery as options', function () {
        var ins = IDOLclient({
            APIkey: 'some API key'
        });
        assert.isObject(ins.options);
        assert.propertyVal(ins.options, 'APIkey', 'some API key');
    });

    it('should accept string and set it as `APIkey` propery in options', function () {
        var ins = IDOLclient('some API key');
        assert.isObject(ins.options);
        assert.propertyVal(ins.options, 'APIkey', 'some API key');
    });

    it('should set default options correctly', function () {
        var ins = IDOLclient('some API key');
        assert.isObject(ins.options);
        assert.deepEqual(ins.options.APIformat, {
            host: 'api.idolondemand.com',
            platform: '1'
        });
    });

    it('should not overwrite options if set but only when undefined', function () {
        var ins = IDOLclient({
            APIkey: 'some API key',
            APIformat: {
                host: 'api.idolondemand.com',
                platform: '111'
            }
        });
        assert.isObject(ins.options);
        assert.notDeepEqual(ins.options.APIformat, {
            host: 'api.idolondemand.com',
            platform: '1'
        });
    });

    it('should inherit evens functionality', function () {
        assert.isFunction(IDOLclient('A').emit);
    });
});
