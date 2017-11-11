// Just some basic polyfills for compatibility with older browsers

Object.assign = require('object-assign');

if (typeof Promise === 'undefined') {
    window.Promise = require('bluebird');
}