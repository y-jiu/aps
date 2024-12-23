import { axiosJSON } from '../../utils/axios'


export const GetProductList = () => {
  return axiosJSON.get(`product`)
}

export const GetProduct = (product_id: number) => {
  return axiosJSON.get(`product/${product_id}`)
}

export const CreateProduct = (data: any) => {
  return axiosJSON.post(`product`, data)
}

export const UpdateProduct = (product_id: number, data: any) => {
  return axiosJSON.put(`product`, {
    ...data,
    id: product_id
  })
}

export const DeleteProduct = (product_id: number) => {
  return axiosJSON.delete(`product/${product_id}`)
}

export const GetMaterialList = () => {
  return axiosJSON.get(`material`)
}

export const GetMaterial = (material_name: string) => {
  return axiosJSON.get(`material/${material_name}`)
}

export const CreateMaterial = (data: any) => {
  return axiosJSON.post(`material`, data)
}

export const UpdateMaterial = (data: any) => {
  return axiosJSON.put(`material`, data)
}

export const DeleteMaterial = (material_id: number) => {
  return axiosJSON.delete(`material/${material_id}`)
}
