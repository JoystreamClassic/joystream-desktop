import levelup from 'levelup'
import Store from './store'
import namespace from 'level-namespace'

// Returns instance of a store immedietly, get/set operations will be queued

/**
 * Open level-up database
 * Automatic use of namespace+Store, as described below, but not async.
 * @param dbPath
 * @returns {Store}
 */
function openImmediate (dbPath) {
  let db = levelup(dbPath, {
    keyEncoding: 'utf8',
    valueEncoding: 'json',
    createIfMissing: true
  }, function (err, db) {
    if (err) return console.log('failed to open level db from: ', dbPath, err)
  })

  namespace(db)

  return new Store(db)
}

// Returns a promise of a store which gets resolved when the database is successfully opened

/**
 * Opens level-up database.
 * Was added to give promise interface which ensures that
 * people wait to make requests until its actually ready, otherwise
 * leveldb will queue requests. Also, namespace feature is required
 * for our Store, which is only available when the database is ready.
 * Lastly, we also want to wrap in a Store, so this service is done automatically,
 * and store does not need to be sensitive to level.up not being ready.
 *
 * NB: It turns out that it _may_ not be required for the namespace feature.
 *
 * @param dbPath
 * @returns {Promise}
 */
function open (dbPath) {
  return new Promise(function (resolve, reject) {
    levelup(dbPath, {
      keyEncoding: 'utf8',
      valueEncoding: 'json',
      createIfMissing: true
    }, function (err, db) {
      if (err) return reject(err)
      namespace(db)
      resolve(new Store(db))
    })
  })
}

export default {openImmediate, open}
