"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageError = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Storage
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Manne Busk
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Storage data
var data = {};

/**
 * Storage Exception
 */

var StorageError = exports.StorageError = function () {
  function StorageError(message, e) {
    _classCallCheck(this, StorageError);

    this.message = message;
  }

  _createClass(StorageError, [{
    key: "toString",
    value: function toString() {
      return this.message + "\n" + e;
    }
  }]);

  return StorageError;
}();

/**
 * Simple JSON file storage
 */


var Storage = function () {
  /**
   * Initialize and loads in stored data from file.
   *
   * @constructor
   * @param {string} fileName
   */
  function Storage(fileName) {
    _classCallCheck(this, Storage);

    this.fileName = fileName;

    this.load();
  }

  /**
   * Load in data from json file
   *
   * @return {Storage}
   */


  _createClass(Storage, [{
    key: "load",
    value: function load() {
      var path = __dirname + "/" + this.fileName;

      try {
        _fs2.default.statSync(path).isFile();
      } catch (e) {
        this.persist();
      }

      try {
        var storageData = _fs2.default.readFileSync(path, { encoding: "utf-8" });
      } catch (e) {
        throw new StorageError("ERROR: Could not read data file.");
      }

      try {
        data = JSON.parse(storageData);
      } catch (e) {
        throw new StorageError("Could not parse data as JSON.");
      }

      return this;
    }

    /**
     * Get number of stored objects
     *
     * @return {number}
     */

  }, {
    key: "size",
    value: function size() {
      return Object.keys(data).length;
    }

    /**
     * Save data to file
     *
     * @return {Storage}
     */

  }, {
    key: "persist",
    value: function persist() {
      var path = __dirname + "/" + this.fileName;
      _fs2.default.writeFileSync(path, JSON.stringify(data));

      return this;
    }

    /**
     * Loop and execute callback for each item in the store
     *
     * @param {function}
     * @return {Storage}
     */

  }, {
    key: "forEach",
    value: function forEach(callback) {
      var obj = Object.assign({}, data);
      Object.keys(obj).forEach(function (key) {
        return callback(obj[key]);
      });

      return this;
    }

    /**
     * Insert item to store
     *
     * @param {string} key
     * @param {object} obj
     * @return {Storage}
     */

  }, {
    key: "insert",
    value: function insert(key, obj) {
      if (typeof key !== "string") {
        throw new StorageError("Key must be a string");
      }

      if ((typeof obj === "undefined" ? "undefined" : _typeof(obj)) !== 'object' || Array.isArray(obj)) {
        var type = typeof obj === "undefined" ? "undefined" : _typeof(obj);
        throw new StorageError("ERROR: We can only insert objects, you tried to insert: " + type);
      }

      var toStore = Object.assign({}, obj);
      data[key] = toStore;

      return this;
    }

    /**
     * Look up a single item by key from the store
     *
     * @param {string} key
     * @return {object|null}
     */

  }, {
    key: "get",
    value: function get(key) {
      if (data.hasOwnProperty(key)) {
        return Object.assign({}, data[key]);
      }

      return null;
    }

    /**
     * Empty the storage data and persist to disk
     *
     * @return {Storage}
     */

  }, {
    key: "wipeAndPersist",
    value: function wipeAndPersist() {
      data = {};
      this.persist();

      return this;
    }
  }]);

  return Storage;
}();

exports.default = Storage;