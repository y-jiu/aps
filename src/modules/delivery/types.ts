// Action types

interface IReceiveProductList {
  readonly type: 'delivery/RECEIVE_PRODUCT_LIST'
  readonly productList: any
}

interface IReceiveProduct {
  readonly type: 'delivery/RECEIVE_PRODUCT'
  readonly product: any
}

interface IReceiveMaterialList {
  readonly type: 'delivery/RECEIVE_MATERIAL_LIST'
  readonly materialList: any
}

interface IReceiveMaterial {
  readonly type: 'delivery/RECEIVE_MATERIAL'
  readonly material: any
}

type ActionTypes = IReceiveProductList | IReceiveProduct | IReceiveMaterialList | IReceiveMaterial

export default ActionTypes
