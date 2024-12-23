import { applyMiddleware, createStore } from 'redux'
import rootReducer, { initialState } from '.'

import { IAppState } from '../types'
import thunk, { ThunkMiddleware } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

export const state: IAppState = {
  ...initialState,

  dashboard: Object.assign({}, initialState.dashboard),
  sales: Object.assign({}, initialState.sales),
  plan: Object.assign({}, initialState.plan),
  user: Object.assign({}, initialState.user),
  information: Object.assign({}, initialState.information),
  delivery: Object.assign({}, initialState.delivery)
}

const middlewares = [thunk as ThunkMiddleware<IAppState>]

const configureStore = () =>
  createStore(
    rootReducer,
    state,
    composeWithDevTools(applyMiddleware(...middlewares))
  )

export default configureStore
