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
    'connectorStatus',
    'createConnector',
    'deleteConnector',
    'retrieveConfig',
    'startConnector',
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
     * Search
     */
    'queryTextIndex',
    'findRelatedConcepts',
    'findSimilar',
    'getContent',
    'getParametricValues',
    'retrieveIndexFields',

    /*!
     * Text Analysis
     */
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

    /*!
     * User Management
     */
    'addStore',
    'addUser',
    'authenticate',
    'deleteStore',
    'deleteUser',
    'listStores',
    'listUsers'
];
