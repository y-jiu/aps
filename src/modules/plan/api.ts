import axios from 'axios';
import { Process } from './types';
export const getPlanList = (dates: { start: string; end: string }) => 
  axios.get(`${process.env.REACT_APP_API_URL}/plan/list/${dates.start}/${dates.end}`);

export const updatePlanState = (payload: { id: string; state: string }) =>
  axios.put(`${process.env.REACT_APP_API_URL}/plan/state/${payload.id}`, { state: payload.state });

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
