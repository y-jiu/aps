import axios from 'axios';
import { Process } from './types';
import { axiosJSON } from '../../utils/axios';
export const getPlanList = (dates: { start: string; end: string }) => 
  axios.get(`${process.env.REACT_APP_API_URL}/plan/list/${dates.start}/${dates.end}`);

// export const updatePlanState = (payload: { id: string; state: string }) =>
//   axios.put(`${process.env.REACT_APP_API_URL}/plan/state/${payload.id}`, { state: payload.state });

export const getFacilities = (planId: string) => 
  axios.get(`${process.env.REACT_APP_API_URL}/facilities/${planId}`);

export const createFacility = (planId: string) =>
  axios.post(`${process.env.REACT_APP_API_URL}/facilities`, { planId });

export const updateFacility = (payload: { id: string; planId: string; [key: string]: any }) =>
  axios.put(`${process.env.REACT_APP_API_URL}/facilities/${payload.id}`, payload);

export const deleteFacility = (payload: { id: string; planId: string }) =>
  axios.delete(`${process.env.REACT_APP_API_URL}/facilities/${payload.id}`);

export const getProcesses = (planId: string) =>
  axios.get(`${process.env.REACT_APP_API_URL}/processes/${planId}`);

export const createProcess = (planId: string) =>
  axios.post(`${process.env.REACT_APP_API_URL}/processes`, { planId });

export const updateProcess = (payload: { id: string; planId: string; [key: string]: any }) =>
  axios.put(`${process.env.REACT_APP_API_URL}/processes/${payload.id}`, payload);

export const deleteProcess = (payload: { id: string; planId: string }) =>
  axios.delete(`${process.env.REACT_APP_API_URL}/processes/${payload.id}`);

export const updateProcessesOrder = (processes: Process[]) =>
  axios.put(`${process.env.REACT_APP_API_URL}/processes/order`, processes);

export const updateProcessData = (payload: { id: string; planId: string; [key: string]: any }) =>
  axios.put(`${process.env.REACT_APP_API_URL}/processes/${payload.id}`, payload);

export const getPlanByDate = (date: string) => {
  return axiosJSON.get(`plan/date/${date}`)
}

export const getPlanByMonth = (year: string, month: string) => {
  return axiosJSON.get(`plan/calendar/${year}/${month}`)
}

export const updatePlan = (data: any) => {
  return axiosJSON.put(`plan`, data)
}

export const createPlan = (data: any) => {
  return axiosJSON.post(`plan`, data)
}

export const updatePlanState = (data: any) => {
  return axiosJSON.put(`plan/state`, data)
}

export const deletePlan = (id: string) => {
  return axiosJSON.delete(`plan/${id}`)
}

export const getPlanProcess = (id: string) => {
  return axiosJSON.get(`planprocess/${id}`)
}

export const getPlanCalendar = (year: string, month: string) => {
  return axiosJSON.get(`plan/calendar/${year}/${month}`)
}

export const getGantt = (start: string, end?: string) => {
  return axiosJSON.get(`gantt/${start}${end ? `?end_date=${end}` : ''}`)
}

export const createGantt = (data: any) => {
  return axiosJSON.post(`gantt`, data)
}

export const updateGantt = (data: any) => {
  return axiosJSON.put(`gantt`, data)
}

export const deleteGantt = (id: string) => {
  return axiosJSON.delete(`gantt/${id}`)
}

export const getGanttCalendar = (year: string, month: string) => {
  return axiosJSON.get(`gantt/calendar/${year}/${month}`)
}

export const getGanttDateToMove = (id: string) => {
  return axiosJSON.get(`gantt/movedate/${id}`)
}

export const createAchievement = (data: any) => {
  return axiosJSON.post(`achievement`, data)
}

export const getAchievement = (id: string) => {
  return axiosJSON.get(`achievement/${id}`)
}

export const updateAchievement = (data: any) => {
  return axiosJSON.put(`achievement`, data)
}

export const deleteAchievement = (id: string) => {
  return axiosJSON.delete(`achievement/${id}`)
}
