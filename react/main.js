var ReactDOM = require('react-dom')
var React = require('react')
var RR = require('react-redux')

import { Router, Route } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

import * as R from '../redux'
import * as views from './views'

import createHistory from 'history/createBrowserHistory'
const browserHistory = createHistory()

const store = R.configureStore(R.defaultState, routerMiddleware(browserHistory))
const history = syncHistoryWithStore(browserHistory, store)

var routes = (
  <RR.Provider store={store}>
    <Router history={history}>
      <Route path='/' component={views.App}>
      </Route>
    </Router>
  </RR.Provider>
)

ReactDOM.render(
  routes,
  document.getElementById('content')
)
