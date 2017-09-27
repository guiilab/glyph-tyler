import * as R from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { rootReducer } from './reducers'
import * as actions from './actions'
import { batchedSubscribe } from 'redux-batched-subscribe'
import { unstable_batchedUpdates } from 'react-dom'

import * as _ from 'lodash'

var loggerMiddleware = createLogger()

var batchDebounce = _.debounce(function(notify) { notify() })
var finalCreateStore = batchedSubscribe(batchDebounce)(R.createStore)

export function configureStore(initialState, routerMiddleware) {
  return finalCreateStore(
    rootReducer,
    initialState,
    R.compose(
      R.applyMiddleware(
        thunkMiddleware,
        loggerMiddleware,
        routerMiddleware
      )
    )
  )
}

export * from './reducers'
export * from './actions'
