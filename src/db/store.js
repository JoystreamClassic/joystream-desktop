
import LevelPromiseInterface from './level-promise-interface'

class Store {

  // Expect a levelup namespaced instance
  constructor (db) {
    this._db = db

    this._namespaces = {}
  }

  close (callback) {
    return this._db.close(callback)
  }

  from (namespace) {
    if (!this._namespaces[namespace]) {
      this._namespaces[namespace] = new LevelPromiseInterface(this._db.namespace(namespace))
    }

    return this._namespaces[namespace]
  }

  save (namespace, key, value) {
    return this.from(namespace).save(key, value)
  }

  remove (namespace, key) {
    return this.from(namespace).remove(key)
  }

  getOne (namespace, key) {
    return this.from(namespace).getOne(key)
  }

  getAllKeys (namespace) {
    return this.from(namespace).getAllKeys()
  }

  getAll (namespace) {
    return this.from(namespace).getAll()
  }

  batch (namespace, ...args) {
    this.from(namespace).batch(...args)
  }
}

export default Store
