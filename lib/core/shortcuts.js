/*!
 * Represents all shortcuts provided as methods by the class
 */

module.exports = [

    /*!
     * Audio-Video Analytics
     */
    'recognizeSpeech',

    /*!
     * Connectors
     */
    'cancelConnectorSchedule',
    'connectorHistory',
    'connectorStatus',
    'createConnector',
    'deleteConnector',
    'retrieveConfig',
    'startConnector',
    'stopConnector',
    'updateConnector',

    /*!
     * Format Conversion
     */
    'expandContainer',
    //'ocrDocument', added under Image Analysis
    'storeObject',
    'extractText',
    'viewDocument',

    /*!
     * Image Analysis
     */
    'recognizeBarCodes',
    'detectFaces',
    'recognizeImages',
    'ocrDocument',

    /*!
     * Policy
     */
    'createClassificationObjects',
    'createPolicyObjects',
    'deleteClassificationObjects',
    'deletePolicyObjects',
    'retrieveClassificationObjects',
    'retrievePolicyObjects',
    'updateClassificationObjects',
    'updatePolicyObjects',

    /*!
     * Prediction
     */
    'predict',
    'recommend',
    'trainPredictor',

    /*!
     * Search
     */
    'createQueryProfile',
    'deleteQueryProfile',
    'queryTextIndex',
    'findRelatedConcepts',
    'findSimilar',
    'getContent',
    'getParametricValues',
    'retrieveIndexFields',
    'updateQueryProfile',

    /*!
     * Text Analysis
     */
    'classifyDocument',
    'categorizeDocument',
    'extractEntities',
    'expandTerms',
    'extractConcepts',
    'highlightText',
    'identifyLanguage',
    'analyzeSentiment',
    'tokenizeText',

    /*!
     * Unstructured Text Indexing
     */
    'addToTextIndex',
    'createTextIndex',
    'deleteTextIndex',
    'deleteFromTextIndex',
    'indexStatus',
    'listIndexes',
    'listResources',
    'restoreTextIndex',

    /*!
     * User Management
     */
    'addRole',
    'addStore',
    'addUser',
    'assignRole',
    'authenticate',
    'deleteRole',
    'deleteStore',
    'deleteUser',
    'listRoles',
    'listStores',
    'listUserRoles',
    'listUsers',
    'unassignRole',
    'verify'
];
