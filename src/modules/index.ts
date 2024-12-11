import dashboard, { initialState as dashboardInitialState } from './dashboard'
import sales, { initialState as salesInitialState } from './sales'
import plan, { initialState as planInitialState } from './plan'
import user, { initialState as userInitialState } from './user'

import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  dashboard,
  sales,
  plan,
  user
})

export const initialState = {
  dashboard: dashboardInitialState,
  sales: salesInitialState,
  plan: planInitialState,
  user: userInitialState
}
  
export default rootReducer

export { dashboardInitialState, salesInitialState, planInitialState }
