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
    dataset: { }, // name, data
    selection: {
      nodes: new Set(), pathNodes: new Set(), nodesClicked: new Set()
    }
  },

  index: {}
}

function selectNodes(state, actionData) {
  var { nodes, isOn, isClicked } = actionData
  var res = {}

  var interactedNodes = (isOn ? _.union : _.difference)(
    state.selection[isClicked ? 'nodesClicked' : 'nodes'],
    nodes
  )

  var allSelectedNodes = _.union(
    interactedNodes, state.selection[isClicked ? 'nodes' : 'nodesClicked']
  )

  function findIntersectedUsers(state, nodes) {
    var users = {}

    nodes.forEach((node) => {
      node.user_ids.forEach((id) => {
        if(!users[id]) users[id] = new Set(); users[id].add(node.id)
      })
    })

    return _.chain(users).toPairs().filter(p => p[1].size === nodes.length).fromPairs().value()
  }

  function findPath(state, nodes) {
    var users = findIntersectedUsers(state, nodes)

    console.log(users)

    return state.dataset.nodes.filter((node) => {
      return _.reduce(node.user_ids, (matched, id) => {
        return matched || users[id]
      }, false)
    })
  }

  return {
    selection: {
      nodesClicked: isClicked ? interactedNodes : state.selection.nodesClicked,
      nodes: new Set(allSelectedNodes.map(n => n.id)),
      pathNodes: new Set(findPath(state, allSelectedNodes).map(n => n.id))
    }
  }
}

function app(state, action) {
  switch (action.type) {
    case A.UPDATE_APP_KEY:
      return _.assign({}, state, _.set({}, action.data.key, action.data.value))
    default:
      return state || defaultState.app
  }
}

function view(state, action) {
  switch (action.type) {
    case A.LOAD_DATA_SET:
      return _.assign({}, state, { dataset: action.data })
    case A.SELECT_NODES:
      return _.assign({}, state, selectNodes(state, action.data))
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
