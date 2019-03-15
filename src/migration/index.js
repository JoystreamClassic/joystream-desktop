import os from 'os'
import path from 'path'
import db from '../db'
import semver from 'semver'

import Application from '../core/Application'
import ApplicationSettings from '../core/ApplicationSettings'
import DefaultAppDirectory from '../defaultAppDirectory'

const debug = require('debug')('application-migration')

function getRunningAppVersion () {
  return require('../../package.json').version
}

// Array of migration tasks (assuming we will only ever need a single path migration,
// for complex migration paths we would need a graph structure)
import MIGRATIONS from './migrations'

/**
 * constructs sequence of migration tasks required to be run when updating from one version to the next
 */
function getMigrationTaskSequence (fromVersion, toVersion) {

  if(semver.gt(toVersion, fromVersion)) {
    // Find index of the first migration task
    let tasks = []

    for (let i in MIGRATIONS) {

      if (MIGRATIONS[i].from === fromVersion) {
        return MIGRATIONS.slice(i)
      }
    }

    return tasks

  } else if (semver.lt(toVersion, fromVersion)) {
    // User has installed an older version of the app
    // We currently do not support backward migration
    return []

  } else {
    // Running same version.. no migration tasks to run
    return []
  }
}

async function runMigrationTasks () {

  const appDirectory = DefaultAppDirectory()
  let appSettings = Application.createApplicationSettings()
  let torrentDbPath = Application.torrentDatabasePath(appDirectory)

  const currentAppVersion = getRunningAppVersion()

  appSettings.open()

  // versions of application prior to v1.0.0 did not store the last ran app version
  // so we will treat them all as version 0.0.0
  const lastRanAppVersion = appSettings.lastRanVersionOfApp() || '0.0.0'

  let migrations = getMigrationTaskSequence(lastRanAppVersion, currentAppVersion)

  console.log('lastRan=', lastRanAppVersion, 'current=', currentAppVersion)
  console.log('running migration tasks', migrations)

  for (let i in migrations) {
    let runTask = migrations[i].task

    await runTask(appSettings, torrentDbPath)
  }

  appSettings.setLastRanVersionOfApp(currentAppVersion)
  appSettings.close()
}


module.exports.runMigrationTasks = runMigrationTasks
