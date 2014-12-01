'use strict';

/*!
 * Module dependencies
 */
var _ = require('lodash');


module.exports = function (IDOLclient) {

    /**
     * Retrieve status of a job by UUID.
     *
     * @param   {String} jobID UUID of the job
     * @returns {Object} Q.promise
     * @api public
     */
    IDOLclient.prototype.jobStatus = function (jobID) {
        // Validate `jobID`.
        if (!jobID || !_.isString(jobID))
            throw new Error('IDOLclient.jobStatus(jobID) requires UUID string as 1st argument');

        return this.request({
            path: '/' + this.options.APIformat.platform + '/job/status/' + jobID
        });
    };

    /**
     * Waits for job result by UUID.
     *
     * @param   {String} jobID UUID of the job
     * @returns {Object} Q.promise
     * @api public
     */
    IDOLclient.prototype.jobResult = function (jobID) {
        // Validate `jobID`.
        if (!jobID || !_.isString(jobID))
            throw new Error('IDOLclient.jobResult(jobID) requires UUID string as 1st argument');

        return this.request({
            path: '/' + this.options.APIformat.platform + '/job/result/' + jobID
        });
    };

    /**
     * Submit(POST) an asynchronous job to IDOL API for processing.
     *
     * @param   {Array} actions Array of `Action` objects to execute. [See here](https://www.idolondemand.com/developer/docs/AsynchronousAPI.htm)
     * @param   {Object} files Collection of files to attach to the POST request
     * @returns {Object} Q.promise
     * @api public
     */
    IDOLclient.prototype.jobAsync = function (actions, files) {
        // Validate `actions` and `files`.
        if (!_.isArray(actions) || _.isEmpty(actions))
            throw new Error('IDOLclient.jobAsync(actions, files) requires none empty array with `Actions` as 1st argument');
        if (files && !_.isPlainObject(files))
            throw new Error('IDOLclient.jobAsync(actions, files) requires {} as 2nd argument');

        return this.request({
            method: 'POST',
            path: '/' + this.options.APIformat.platform + '/job',
            parameters: {
                job: {
                    actions: actions
                }
            },
            files: files
        });
    };
};
