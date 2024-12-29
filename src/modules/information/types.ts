// Action types

interface IReceiveCompany {
  readonly type: 'information/RECEIVE_COMPANY'
  readonly company: any
}

interface IReceiveCompanyList {
  readonly type: 'information/RECEIVE_COMPANY_LIST'
  readonly companyList: any
}

interface IReceiveProductList {
  readonly type: 'information/RECEIVE_PRODUCT_LIST'
  readonly productList: any
}

interface IReceiveProduct {
  readonly type: 'information/RECEIVE_PRODUCT'
  readonly product: any
}

interface IReceiveFacilityList {
  readonly type: 'information/RECEIVE_FACILITY_LIST'
  readonly facilityList: any
}

interface IReceiveFacility {
  readonly type: 'information/RECEIVE_FACILITY'
  readonly facility: any
}

interface IReceiveProcessList {
  readonly type: 'information/RECEIVE_PROCESS_LIST'
  readonly processList: any
}

interface IReceiveProcess {
  readonly type: 'information/RECEIVE_PROCESS'
  readonly process: any
}

interface IUpdateCompany {
  readonly type: 'information/UPDATE_COMPANY'
  readonly data: any
}

interface IUpdateData {
  readonly type: 'dashboard/UPDATE_DATA'
  readonly data: any
}

interface IUpdateRealTimeData {
  readonly type: 'dashboard/UPDATE_REALTIME_DATA'
  readonly data: any
}

interface IUpdateSheets {
  readonly type: 'sales/UPDATE_SHEETS'
  readonly data: any
}

interface IReceiveProcessManagement {
  readonly type: 'information/RECEIVE_PROCESS_MANAGEMENT'
  readonly processManagement: any
}

interface IUpdateProcessManagement {
  readonly type: 'information/UPDATE_PROCESS_MANAGEMENT'
  readonly data: any
}

type ActionTypes = IReceiveCompany | IReceiveCompanyList | IUpdateCompany | IUpdateData | IUpdateRealTimeData | IUpdateSheets | IReceiveProductList | IReceiveProduct | IReceiveFacilityList | IReceiveFacility | IReceiveProcessList | IReceiveProcess | IReceiveProcessManagement | IUpdateProcessManagement

export default ActionTypes