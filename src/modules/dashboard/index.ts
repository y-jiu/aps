import * as DashboardAPIUtil from './api'
// import axios from 'axios'
import ActionTypes from './types'
import { Dispatch } from 'redux'
// import { CNCData, type CNCRealTimeData } from '../../utils/cncData'

const RECEIVE_SAFETY = 'dashboard/RECEIVE_SAFETY'
const UPDATE_DATA = 'dashboard/UPDATE_DATA'
const UPDATE_REALTIME_DATA = 'dashboard/UPDATE_REALTIME_DATA'

export const receiveSafety = (safety: any) => ({
  type: RECEIVE_SAFETY,
  safety
})

export const updateData = (data: any) => ({
  type: UPDATE_DATA,
  data
})

export const updateRealTimeData = (data: any) => ({
  type: UPDATE_REALTIME_DATA,
  data
})

export const GetSafety = (spot_id: number) => async (dispatch: Dispatch) => {
  const res = await DashboardAPIUtil.GetSafety(spot_id)
  dispatch(receiveSafety(res.data))
  // return res.data
}

export interface IDashboardState {
  safety: any
  // data: CNCData[]
  // realTimeData: CNCRealTimeData[]
}

export const initialState: IDashboardState = {
  safety: {},
  // data: [],
  // realTimeData: []
}

const reducer = (
  state: IDashboardState = initialState,
  action: ActionTypes
) => {
  Object.freeze(state)
  const newState = Object.assign({}, state)

  switch (action.type) {
    case RECEIVE_SAFETY:
      return {
        ...newState,
        safety: action.safety
      }

    case UPDATE_DATA:
      return {
        ...newState,
        data: action.data
      }

    case UPDATE_REALTIME_DATA:
      return {
        ...newState,
        realTimeData: action.data
      }

    default:
      return state
  }
}

export default reducer
