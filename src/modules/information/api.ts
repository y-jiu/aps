import { axiosJSON } from '../../utils/axios'

export const GetCompanyList = () => {
  return axiosJSON.get(`company`)
}

export const GetCompany = (company_id: number) => {
  return axiosJSON.get(`company/${company_id}`)
}

export const CreateCompany = (data: any) => {
  return axiosJSON.post(`company`, data)
}

export const UpdateCompany = (company_id: number, data: any) => {
  return axiosJSON.put(`company`, {
    ...data,
    id: company_id
  })
}

export const DeleteCompany = (company_id: number) => {
  return axiosJSON.delete(`company/${company_id}`)
}

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

export const GetFacilityList = () => {
  return axiosJSON.get(`facility`)
}

export const GetFacility = (facility_id: number) => {
  return axiosJSON.get(`facility/${facility_id}`)
}

export const CreateFacility = (data: any) => {
  return axiosJSON.post(`facility`, data)
}

export const UpdateFacilityName = (data: any) => {
  return axiosJSON.put(`facility/name`, data)
}

export const UpdateFacilityOrder = (data: any) => {
  return axiosJSON.put(`facility/order`, data)
}

export const DeleteFacility = (facility_id: number) => {
  return axiosJSON.delete(`facility/${facility_id}`)
}

export const GetProcessList = () => {
  return axiosJSON.get(`process`)
}

export const CreateProcess = (data: any) => {
  return axiosJSON.post(`process`, data)
}

export const UpdateProcess = (data: any) => {
  return axiosJSON.put(`process`, data)
}

export const DeleteProcess = (process_name: string) => {
  return axiosJSON.delete(`process/${process_name}`)
}

export const CreateProcessManagement = (data: any) => {
  return axiosJSON.post(`processmanagement`, data)
}

export const UpdateProcessManagement = (data: any) => {
  return axiosJSON.put(`processmanagement`, data)
}

export const DeleteProcessManagement = (product_name: string) => {
  return axiosJSON.delete(`processmanagement?product_name=${product_name}`)
}

export const GetProcessManagement = (product_name: string) => {
  return axiosJSON.get(`processmanagement?product_name=${product_name}`)
}
