import * as DeliveryAPIUtil from './api'
// import axios from 'axios'
import ActionTypes from './types'
import { Dispatch } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

const RECEIVE_PRODUCT_LIST = 'delivery/RECEIVE_PRODUCT_LIST'
const RECEIVE_PRODUCT = 'delivery/RECEIVE_PRODUCT'
const RECEIVE_MATERIAL_LIST = 'delivery/RECEIVE_MATERIAL_LIST'
const RECEIVE_MATERIAL = 'delivery/RECEIVE_MATERIAL'


export const receiveProductList = (productList: any) => ({
  type: RECEIVE_PRODUCT_LIST,
  productList
})

export const receiveProduct = (product: any) => ({
  type: RECEIVE_PRODUCT,
  product
})

export const receiveMaterialList = (materialList: any) => ({
  type: RECEIVE_MATERIAL_LIST,
  materialList
})

export const receiveMaterial = (material: any) => ({
  type: RECEIVE_MATERIAL,
  material
})

export const getProductList = () => async (dispatch: Dispatch) => {
  const response = await DeliveryAPIUtil.GetProductList();
  dispatch(receiveProductList(response.data));
};

export const getProduct = (product_id: number) => async (dispatch: Dispatch) => {
  const response = await DeliveryAPIUtil.GetProduct(product_id);
  dispatch(receiveProduct(response.data));
};

export const createProduct = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await DeliveryAPIUtil.CreateProduct(data);
  dispatch(getProductList());
};

export const updateProduct = (product_id: number, data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await DeliveryAPIUtil.UpdateProduct(product_id, data);
  dispatch(getProductList());
};

export const deleteProduct = (product_id: number) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await DeliveryAPIUtil.DeleteProduct(product_id);
  dispatch(getProductList());
};

export const getMaterialList = () => async (dispatch: Dispatch) => {
  const response = await DeliveryAPIUtil.GetMaterialList();
  dispatch(receiveMaterialList(response.data));
};

export const getMaterial = (material_name: string) => async (dispatch: Dispatch) => {
  const response = await DeliveryAPIUtil.GetMaterial(material_name);
  dispatch(receiveMaterial(response.data));
};

export const createMaterial = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await DeliveryAPIUtil.CreateMaterial(data);
  dispatch(getMaterialList());
};

export const updateMaterial = (data: any) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await DeliveryAPIUtil.UpdateMaterial(data);
  dispatch(getMaterialList());
};

export const deleteMaterial = (material_id: number) => async (dispatch: ThunkDispatch<any, any, AnyAction>) => {
  const response = await DeliveryAPIUtil.DeleteMaterial(material_id);
  dispatch(getMaterialList());
};



export interface IDeliveryState {
  product: any
  productList: any[]
  material: any
  materialList: any[]
}

export const initialState: IDeliveryState = {
  product: {},
  productList: [],
  material: {},
  materialList: []
}

const reducer = (
  state: IDeliveryState = initialState,
  action: ActionTypes
) => {
  Object.freeze(state)
  const newState = Object.assign({}, state)

  switch (action.type) {
    case RECEIVE_PRODUCT:
      return {
        ...newState,
        product: action.product
      }
    case RECEIVE_MATERIAL_LIST:
      return {
        ...newState,
        materialList: action.materialList
      }
    case RECEIVE_PRODUCT_LIST:
      return {
        ...newState,
        productList: action.productList
      }
    case RECEIVE_MATERIAL:
      return {
        ...newState,
        material: action.material
      }
    default:
      return state
  }
}

export default reducer
