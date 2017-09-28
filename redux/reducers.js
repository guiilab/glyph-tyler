var A = require('./actions')
var combineReducers = require('redux').combineReducers
var _ = require('lodash')
var ReduxResponsive = require('redux-responsive')
var RRR = require('react-router-redux')

export var defaultState = {
  app: {
    visHeight: null
  },

  view: {
    dataset: { } // name, data
  },

  index: {}
}

function app(state, action) {
  switch (action.type) {
    case A.UPDATE_APP_KEY:
      return _.assign({}, _.set({}, action.data.key, action.data.value))
    default:
      return state || defaultState.app
  }
}

function view(state, action) {
  switch (action.type) {
    case A.LOAD_DATA_SET:
      return _.assign({}, { dataset: action.data })
    default:
      return state || defaultState.view
  }
}

function index() {
  return {}
}

export var rootReducer = combineReducers({
  app,
  index,
  view,
  browser: ReduxResponsive.responsiveStateReducer,
  routing: RRR.routerReducer
})
