/**
 * Storage
 *
 * @author Manne Busk
 */
import fs from "fs";

// Storage data
let data = {};

/**
 * Storage Exception
 */
export class StorageError {
  constructor(message, e) {
    this.message = message;
  }
  toString() {
    return this.message + "\n" + e;
  }
}

/**
 * Simple JSON file storage
 */
class Storage {
  /**
   * Initialize and loads in stored data from file.
   *
   * @constructor
   * @param {string} fileName
   */
  constructor(fileName) {
    this.fileName = fileName;

    this.load();
  }

  /**
   * Load in data from json file
   *
   * @return {Storage}
   */
  load() {
    let path = __dirname + "/" + this.fileName;

    try {
      fs.statSync(path).isFile();
    } catch (e) {
      this.persist();
    }

    try {
      var storageData = fs.readFileSync(path, {encoding: "utf-8"});
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
  size() {
    return Object.keys(data).length;
  }

  /**
   * Save data to file
   *
   * @return {Storage}
   */
  persist() {
    let path = __dirname + "/" + this.fileName;
    fs.writeFileSync(path, JSON.stringify(data));

    return this;
  }

  /**
   * Loop and execute callback for each item in the store
   *
   * @param {function}
   * @return {Storage}
   */
  forEach(callback) {
    let obj = Object.assign({}, data);
    Object.keys(obj).forEach(key => callback(obj[key]));

    return this;
  }

  /**
   * Insert item to store
   *
   * @param {string} key
   * @param {object} obj
   * @return {Storage}
   */
  insert(key, obj) {
    if (typeof key !== "string") {
      throw new StorageError("Key must be a string");
    }

    if (typeof obj !== 'object' || Array.isArray(obj)) {
      let type = typeof obj;
      throw new StorageError(
        "ERROR: We can only insert objects, you tried to insert: " + type
      );
    }

    let toStore = Object.assign({}, obj);
    data[key] = toStore;

    return this;
  }

  /**
   * Look up a single item by key from the store
   *
   * @param {string} key
   * @return {object|null}
   */
  get(key) {
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
  wipeAndPersist() {
    data = {};
    this.persist()

    return this;
  }
}

export default Storage;
