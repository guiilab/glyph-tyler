var A = require('./actions')
var combineReducers = require('redux').combineReducers
var _ = require('lodash')
var ReduxResponsive = require('redux-responsive')
var RRR = require('react-router-redux')

function app() {
  return {}
}

function index() {
  return {}
}

export var rootReducer = combineReducers({
  app,
  index,
  browser: ReduxResponsive.responsiveStateReducer,
  routing: RRR.routerReducer
})
