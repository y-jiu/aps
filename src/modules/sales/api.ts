import { axiosJSON } from '../../utils/axios'

export const GetSafety = (spot_id: number) => {
  return axiosJSON.get(`dashboard/get-safety`, {
    params: {
      spot_id: spot_id
    }
  })
}
