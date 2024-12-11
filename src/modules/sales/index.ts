import * as DashboardAPIUtil from './api'
// import axios from 'axios'
import ActionTypes from './types'
import { Dispatch } from 'redux'
// import { CNCData, type CNCRealTimeData } from '../../utils/cncData'

// const RECEIVE_SAFETY = 'dashboard/RECEIVE_SAFETY'
const UPDATE_DATA = 'dashboard/UPDATE_DATA'
// const UPDATE_REALTIME_DATA = 'dashboard/UPDATE_REALTIME_DATA'
const UPDATE_SHEETS = 'sales/UPDATE_SHEETS'

export const updateSheets = (data: any) => ({
  type: UPDATE_SHEETS,
  data
})

// export const receiveSafety = (safety: any) => ({
//   type: RECEIVE_SAFETY,
//   safety
// })

export const updateData = (data: any) => {
  return {
    type: 'UPDATE_DATA',
    payload: data
  };
};

// export const updateRealTimeData = (data: any) => ({
//   type: UPDATE_REALTIME_DATA,
//   data
// })


// export const GetSafety = (spot_id: number) => async (dispatch: Dispatch) => {
//   const res = await DashboardAPIUtil.GetSafety(spot_id)
//   dispatch(receiveSafety(res.data))
//   // return res.data
// }

export interface ISalesState {
  // safety: any
  // data: CNCData[]
  // realTimeData: CNCRealTimeData[]
  sheets: any[]
}

export const initialState: ISalesState = {
  // safety: {},
  // data: [],
  // realTimeData: []
  sheets: [{
    '업체명': null,
    '품명': null,
    'L/N': null,
    '소재 품번': null,
    '소재 수량': null,
    '가공 품번': null,
    '가공 수량': null,
    '출하일자': null,
    '출하시간': null,
    '비고': null
  }]
}

const reducer = (
  state: ISalesState = initialState,
  action: ActionTypes
) => {
  Object.freeze(state)
  const newState = Object.assign({}, state)

  switch (action.type) {
    case UPDATE_SHEETS:
      return {
        ...newState,
        sheets: action.data
      }
    // case RECEIVE_SAFETY:
    //   return {
    //     ...newState,
    //     safety: action.safety
    //   }

    // case UPDATE_DATA:
    //   return {
    //     ...newState,
    //     data: action.data
    //   }

    // case UPDATE_REALTIME_DATA:
    //   return {
    //     ...newState,
    //     realTimeData: action.data
    //   }

    default:
      return state
  }
}

export default reducer
