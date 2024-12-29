import * as InformationAPIUtil from './api'
// import axios from 'axios'
import ActionTypes from './types'
import { Dispatch } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

const RECEIVE_COMPANY = 'information/RECEIVE_COMPANY'
const RECEIVE_COMPANY_LIST = 'information/RECEIVE_COMPANY_LIST'
const RECEIVE_PRODUCT_LIST = 'information/RECEIVE_PRODUCT_LIST'
const RECEIVE_PRODUCT = 'information/RECEIVE_PRODUCT'
const RECEIVE_FACILITY_LIST = 'information/RECEIVE_FACILITY_LIST'
const RECEIVE_FACILITY = 'information/RECEIVE_FACILITY'
const RECEIVE_PROCESS_LIST = 'information/RECEIVE_PROCESS_LIST'
const RECEIVE_PROCESS = 'information/RECEIVE_PROCESS'
const UPDATE_COMPANY = 'information/UPDATE_COMPANY'
const RECEIVE_PROCESS_MANAGEMENT = 'information/RECEIVE_PROCESS_MANAGEMENT'
const UPDATE_PROCESS_MANAGEMENT = 'information/UPDATE_PROCESS_MANAGEMENT'

export const receiveCompany = (company: any) => ({
  type: RECEIVE_COMPANY,
  company
})

export const receiveCompanyList = (companyList: any) => ({
  type: RECEIVE_COMPANY_LIST,
  companyList
})

export const receiveProductList = (productList: any) => ({
  type: RECEIVE_PRODUCT_LIST,
  productList
})

export const receiveProduct = (product: any) => ({
  type: RECEIVE_PRODUCT,
  product
})

export const receiveFacilityList = (facilityList: any) => ({
  type: RECEIVE_FACILITY_LIST,
  facilityList
})

export const receiveFacility = (facility: any) => ({
  type: RECEIVE_FACILITY,
  facility
})

export const receiveProcessList = (processList: any) => ({
  type: RECEIVE_PROCESS_LIST,
  processList
})

export const receiveProcess = (process: any) => ({
  type: RECEIVE_PROCESS,
  process
})

export const receiveProcessManagement = (processManagement: any) => ({
  type: RECEIVE_PROCESS_MANAGEMENT,
  processManagement
})

// export const updateProcessManagement = (processManagement: any) => ({
//   type: UPDATE_PROCESS_MANAGEMENT,
//   processManagement
// })

export const getCompanyList = () => async (dispatch: Dispatch) => {
  const response = await InformationAPIUtil.GetCompanyList();
  dispatch(receiveCompanyList(response.data));
  console.log(response.data)
};

export const getCompany = (company_id: number) => async (dispatch: Dispatch) => {
  const response = await InformationAPIUtil.GetCompany(company_id);
  dispatch(receiveCompany(response.data));
};

export const updateCompany = (company_id: number, data: any) => async (
  dispatch: ThunkDispatch<any, any, AnyAction>
) => {
  const response = await InformationAPIUtil.UpdateCompany(company_id, data);
  dispatch(getCompanyList());
};

export const createCompany = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.CreateCompany(data);
  dispatch(getCompanyList());
};

export const deleteCompany = (company_id: number) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.DeleteCompany(company_id);
  dispatch(getCompanyList());
};

export const getProductList = () => async (dispatch: Dispatch) => {
  const response = await InformationAPIUtil.GetProductList();
  dispatch(receiveProductList(response.data));
};

export const getProduct = (product_id: number) => async (dispatch: Dispatch) => {
  const response = await InformationAPIUtil.GetProduct(product_id);
  dispatch(receiveProduct(response.data));
};

export const createProduct = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.CreateProduct(data);
  dispatch(getProductList());
};

export const updateProduct = (product_id: number, data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.UpdateProduct(product_id, data);
  dispatch(getProductList());
};

export const deleteProduct = (product_id: number) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.DeleteProduct(product_id);
  dispatch(getProductList());
};

export const getFacilityList = () => async (dispatch: Dispatch) => {
  const response = await InformationAPIUtil.GetFacilityList();
  dispatch(receiveFacilityList(response.data));
};

export const getFacility = (facility_id: number) => async (dispatch: Dispatch) => {
  const response = await InformationAPIUtil.GetFacility(facility_id);
  dispatch(receiveFacility(response.data));
};

export const createFacility = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.CreateFacility(data);
  dispatch(getFacilityList());
};

export const updateFacilityOrder = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.UpdateFacilityOrder(data);
  dispatch(getFacilityList());
};

export const updateFacilityName = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.UpdateFacilityName(data);
  dispatch(getFacilityList());
};

export const deleteFacility = (facility_id: number) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.DeleteFacility(facility_id);
  dispatch(getFacilityList());
};

export const getProcessList = () => async (dispatch: Dispatch) => {
  const response = await InformationAPIUtil.GetProcessList();
  dispatch(receiveProcessList(response.data));
};

export const createProcess = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.CreateProcess(data);
  dispatch(getProcessList());
};

export const updateProcess = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.UpdateProcess(data);
  dispatch(getProcessList());
};

export const deleteProcess = (process_name: string) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.DeleteProcess(process_name);
  dispatch(getProcessList());
};

export const getProcessManagement = (product_name: string) => async (dispatch: Dispatch) => {
  const response = await InformationAPIUtil.GetProcessManagement(product_name);
  dispatch(receiveProcessManagement(response.data));
};

export const createProcessManagement = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.CreateProcessManagement(data);
  dispatch(getProcessManagement(data.product_name));
};

export const updateProcessManagement = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.UpdateProcessManagement(data);
  dispatch(getProcessManagement(data.product_name));
};

export const deleteProcessManagement = (product_name: string) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await InformationAPIUtil.DeleteProcessManagement(product_name);
  dispatch(getProcessManagement(product_name));
};

export interface IInformationState {
  company: any
  companyList: any[]
  product: any
  productList: any[]
  facility: any
  facilityList: any[]
  process: any
  processList: any[]
  processManagement: any
}

export const initialState: IInformationState = {
  company: {},
  companyList: [],
  product: {},
  productList: [],
  facility: {},
  facilityList: [],
  process: {},
  processList: [],
  processManagement: {}
}

const reducer = (
  state: IInformationState = initialState,
  action: ActionTypes
) => {
  Object.freeze(state)
  const newState = Object.assign({}, state)

  switch (action.type) {
    case RECEIVE_COMPANY:
      return {
        ...newState,
        company: action.company
      }
    case RECEIVE_COMPANY_LIST:
      return {
        ...newState,
        companyList: action.companyList
      }
    case RECEIVE_PRODUCT_LIST:
      return {
        ...newState,
        productList: action.productList
      }
    case RECEIVE_FACILITY_LIST:
      return {
        ...newState,
        facilityList: action.facilityList
      }
    case RECEIVE_FACILITY:
      return {
        ...newState,
        facility: action.facility
      }
    case RECEIVE_PROCESS_LIST:
      return {
        ...newState,
        processList: action.processList
      }
    case RECEIVE_PROCESS:
      return {
        ...newState,
        process: action.process
      }
    case RECEIVE_PROCESS_MANAGEMENT:
      return {
        ...newState,
        processManagement: action.processManagement
      }
    default:
      return state
  }
}

export default reducer
