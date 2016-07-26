"use strict";

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

var _storage = require("../storage.js");

var _storage2 = _interopRequireDefault(_storage);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var should = _chai2.default.should();

describe("Storage", function () {
  it("Store initialized", function () {
    var store = new _storage2.default("tests/data/storage.json");
    store.insert("test", { "test": true }).persist();

    should.equal(store.get("test").test, true);
    store.size().should.be.at.least(1);
  });

  it("Store read/write works", function () {
    var store = new _storage2.default("tests/data/storage.json");
    store.insert("test2", { "hello": "world" }).persist();
    var store2 = new _storage2.default("tests/data/storage.json");

    should.equal(store2.get("test2").hello, "world");
  });

  it("Get size is correct", function () {
    var store = new _storage2.default("tests/data/storage.json");

    should.equal(store.size(), 2);
  });

  it("Can only insert objects", function () {
    var store = new _storage2.default("tests/data/storage.json");

    var key = "key";
    var arr = function arr() {
      return store.insert(key, [1, 2, 3]);
    };
    var str = function str() {
      return store.insert(key, "HAHAHAHA");
    };
    var num = function num() {
      return store.insert(key, 99.34);
    };
    var bool = function bool() {
      return store.insert(key, true);
    };
    var func = function func() {
      return store.insert(key, function nej() {
        return false;
      });
    };
    var obj = function obj() {
      return store.insert(key, { yes: true });
    };

    should.Throw(arr, _storage.StorageError);
    should.Throw(str, _storage.StorageError);
    should.Throw(num, _storage.StorageError);
    should.Throw(bool, _storage.StorageError);
    should.Throw(func, _storage.StorageError);
    should.not.Throw(obj, _storage.StorageError);
  });

  it("Insert key must be string", function () {
    var store = new _storage2.default("tests/data/storage.json");

    var ins = { yes: true };
    var arr = function arr() {
      return store.insert([1, 2, 3], ins);
    };
    var str = function str() {
      return store.insert("HAHAHAHA", ins);
    };
    var num = function num() {
      return store.insert(99.34, ins);
    };
    var bool = function bool() {
      return store.insert(true, ins);
    };
    var func = function func() {
      return store.insert(function nej() {
        return false;
      }, ins);
    };
    var obj = function obj() {
      return store.insert({ yes: true }, ins);
    };

    should.Throw(arr, _storage.StorageError);
    should.Throw(num, _storage.StorageError);
    should.Throw(bool, _storage.StorageError);
    should.Throw(func, _storage.StorageError);
    should.Throw(obj, _storage.StorageError);
    should.not.Throw(str, _storage.StorageError);
  });

  it("Items fetched as copy", function () {
    var store = new _storage2.default("tests/data/storage.json");
    var one = store.get("test");
    var two = store.get("test");

    should.not.equal(one, two);
    should.equal(one, one);
    should.equal(two, two);
  });

  it("Wiping the store works", function () {
    var store = new _storage2.default("tests/data/storage.json");
    store.size().should.be.at.least(1);

    store.wipeAndPersist();
    var data = new _storage2.default("tests/data/storage.json");
    should.equal(data.size(), 0);
  });
});