import dashboard, { initialState as dashboardInitialState } from './dashboard'
import sales, { initialState as salesInitialState } from './sales'
import plan, { initialState as planInitialState } from './plan'
import user, { initialState as userInitialState } from './user'
import information, { initialState as informationInitialState } from './information'
import delivery, { initialState as deliveryInitialState } from './delivery'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  dashboard,
  sales,
  plan,
  user,
  information,
  delivery
})

export const initialState = {
  dashboard: dashboardInitialState,
  sales: salesInitialState,
  plan: planInitialState,
  user: userInitialState,
  information: informationInitialState,
  delivery: deliveryInitialState
}
  
export default rootReducer

export { dashboardInitialState, salesInitialState, planInitialState, userInitialState, informationInitialState, deliveryInitialState }
