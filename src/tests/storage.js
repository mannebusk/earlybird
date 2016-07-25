import chai     from "chai";
import Storage, {StorageError}  from "../storage.js";
import Claims   from "../claims.js";
import fs       from "fs";

const should = chai.should();

let test = new Claims("tests/data/storage.json");

describe("Storage", () => {
  it("Store initialized", () => {
    let store     = new Storage("tests/data/storage.json");
    store.insert("test", { "test": true }).persist();

    should.equal(store.get("test").test, true);
    store.size().should.be.at.least(1);
  });
  
  it("Store read/write works", () => {
    let store     = new Storage("tests/data/storage.json");
    store.insert("test2", {"hello": "world"}).persist();
    let store2    = new Storage("tests/data/storage.json");

    should.equal(store2.get("test2").hello, "world");
  });


  it("Get size is correct", () => {
    let store     = new Storage("tests/data/storage.json");

    should.equal(store.size(), 2);
  });

  it("Can only insert objects", () => {
    let store     = new Storage("tests/data/storage.json");

    let key   = "key";
    let arr   = () => store.insert(key, [1,2,3])
    let str   = () => store.insert(key, "HAHAHAHA")
    let num   = () => store.insert(key, 99.34)
    let bool  = () => store.insert(key, true)
    let func  = () => store.insert(key, function nej() { return false; })
    let obj   = () => store.insert(key, {yes: true})

    should.Throw(arr, StorageError);
    should.Throw(str, StorageError);
    should.Throw(num, StorageError);
    should.Throw(bool, StorageError);
    should.Throw(func, StorageError);
    should.not.Throw(obj, StorageError);
  });

  it("Insert key must be string", () => {
    let store     = new Storage("tests/data/storage.json");

    let ins   = { yes: true };
    let arr   = () => store.insert([1,2,3], ins)
    let str   = () => store.insert("HAHAHAHA", ins)
    let num   = () => store.insert(99.34, ins)
    let bool  = () => store.insert(true, ins)
    let func  = () => store.insert(function nej() { return false; }, ins)
    let obj   = () => store.insert({yes: true}, ins)

    should.Throw(arr, StorageError);
    should.Throw(num, StorageError);
    should.Throw(bool, StorageError);
    should.Throw(func, StorageError);
    should.Throw(obj, StorageError);
    should.not.Throw(str, StorageError);
  });

  it("Items fetched as copy", () => {
    let store     = new Storage("tests/data/storage.json");
    let one = store.get("test");
    let two = store.get("test");

    should.not.equal(one, two);
    should.equal(one, one);
    should.equal(two, two);
  });

  it("Wiping the store works", () => {
    let store     = new Storage("tests/data/storage.json");
    store.size().should.be.at.least(1);

    store.wipeAndPersist();
    let data      = new Storage("tests/data/storage.json");
    should.equal(data.size(), 0);
  });
});

