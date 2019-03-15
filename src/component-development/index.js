import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'

// babel-polyfill for generator (async/await)
import 'babel-polyfill'

/**
 * Isolated application store just for powering Components
 */

var MockTorrent = require('../../test/core/Mocks').MockTorrent
import Application from '../core/Application'
import {MockApplication} from '../../test/core/Mocks'
import UIStore from '../scenes/UIStore'

import IsolatedComponents from './IsolatedComponents'
import {default as ApplicationScene} from '../scenes/Application'
import MockApplicationAnimator from './MockApplicationAnimator'

//let app = new MockApplication(Application.STATE.STOPPED, [], true)

let animator = new MockApplicationAnimator(false)
let uiStore = new UIStore(animator.mockApplication)

// Expose in top scope for easy access from console
let app = animator.mockApplication

/**
 * Some Components use react-tap-event-plugin to listen for touch events because onClick is not
 * fast enough This dependency is temporary and will eventually go away.
 * Until then, be sure to inject this plugin at the start of your app.
 *
 * NB:! Can only be called once per application lifecycle
 */
var injectTapEventPlugin = require('react-tap-event-plugin')
injectTapEventPlugin()

// Setup future rendering
if (module.hot) {
    module.hot.accept(render)
}

// First time render
render()

function render() {
  // NB: We have to re-require Application every time, or else this won't work
  var AppContainer = require('react-hot-loader').AppContainer
  //var ComponentDevelopmentApplication = require('./App').default

  let style = {
    a: {
      padding: '10px',
      margin: '20px',
      backgroundColor: 'green',
      fontSize: '22px'
    }
  }

  ReactDOM.render(
    <AppContainer>
      <HashRouter>
        <div>
          <Link to="application" style={style.a}>
            Application
          </Link>

          <Link to="isolated_components" style={style.a}>
            Isolated Components
          </Link>

          <hr/>

          <Route path="/application" render={(routeProps) => {
            return (
              <ApplicationScene UIStore={uiStore} displayMobxDevTools={false}/>
            )
          }}
          />
          <Route path="/isolated_components" render={(routeProps) => {
            return (
              <IsolatedComponents />
            )
          }}
          />

        </div>
      </HashRouter>
    </AppContainer>
    ,
    document.getElementById('root')
  )
}