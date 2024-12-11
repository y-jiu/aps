// Action types

interface IReceiveSafety {
  readonly type: 'dashboard/RECEIVE_SAFETY'
  readonly safety: any
}

interface IUpdateData {
  readonly type: 'dashboard/UPDATE_DATA'
  readonly data: any
}

interface IUpdateRealTimeData {
  readonly type: 'dashboard/UPDATE_REALTIME_DATA'
  readonly data: any
}

type ActionTypes = IReceiveSafety | IUpdateData | IUpdateRealTimeData

export default ActionTypes
