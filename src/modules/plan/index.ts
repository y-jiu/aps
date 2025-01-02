import * as PlanAPIUtil from './api';
import ActionTypes, { Facility, Process } from './types';
import { Dispatch } from 'redux';

export interface PlanState {
  planDatas: any[];
  selectedPlanId: number;
  selectedPlanState: string;
  selectedPlanBomState: string;
  day_planBOM: {
    day: Date | null;
  };
  facilities: Facility[];
  loading: boolean;
  error: string | null;
  processes: Process[];
  processLoading: boolean;
  processError: string | null;
  day: {
    startDay: Date | null;
    endDay: Date | null;
  };
  isExpanded: boolean;
  filterQuery: any;
  planList: any[];
  gantt: any;
}

export const initialState: PlanState = {
  planDatas: [],
  selectedPlanId: 0,
  selectedPlanState: '',
  selectedPlanBomState: '',
  day_planBOM: {
    day: null
  },
  facilities: [],
  loading: false,
  error: null,
  processes: [],
  processLoading: false,
  processError: null,
  isExpanded: false,
  day: {
    startDay: null,
    endDay: null
  },
  filterQuery: {},
  planList: [],
  gantt: []
};

// Action Types
const SET_PLAN_DATA = 'plan/SET_PLAN_DATA';
const SET_SELECTED_PLAN_ID = 'plan/SET_SELECTED_PLAN_ID';
const SET_SELECTED_PLAN_STATE = 'plan/SET_SELECTED_PLAN_STATE';
const SET_SELECTED_PLAN_BOM_STATE = 'plan/SET_SELECTED_PLAN_BOM_STATE';
const SET_FACILITIES = 'plan/SET_FACILITIES';
const ADD_FACILITY = 'plan/ADD_FACILITY';
const DELETE_FACILITY = 'plan/DELETE_FACILITY';
const UPDATE_FACILITY = 'plan/UPDATE_FACILITY';
const SET_LOADING = 'plan/SET_LOADING';
const SET_ERROR = 'plan/SET_ERROR';
const SET_PROCESSES = 'plan/SET_PROCESSES';
const ADD_PROCESS = 'plan/ADD_PROCESS';
const UPDATE_PROCESS = 'plan/UPDATE_PROCESS';
const DELETE_PROCESS = 'plan/DELETE_PROCESS';
const UPDATE_PROCESS_ORDER = 'plan/UPDATE_PROCESS_ORDER';
const SET_DAY_PLAN_BOM = 'plan/SET_DAY_PLAN_BOM';
const SET_IS_EXPANDED = 'plan/SET_IS_EXPANDED';
const SET_FILTER_QUERY = 'plan/SET_FILTER_QUERY';
const RECEIVE_PLAN_LIST = 'plan/RECEIVE_PLAN_LIST';
const RECEIVE_GANTT = 'plan/RECEIVE_GANTT';

// Action Creators
export const setPlanData = (planData: any[]) => ({
  type: SET_PLAN_DATA,
  planData
});

export const setSelectedPlanId = (id: string) => ({
  type: SET_SELECTED_PLAN_ID,
  id
});

export const setSelectedPlanState = (state: string) => ({
  type: SET_SELECTED_PLAN_STATE,
  state
});

export const setSelectedPlanBomState = (state: string) => ({
  type: SET_SELECTED_PLAN_BOM_STATE,
  state
});

export const setFacilities = (facilities: Facility[]) => ({
  type: SET_FACILITIES,
  facilities
});

export const addFacility = (facility: Facility) => ({
  type: ADD_FACILITY,
  facility
});

export const deleteFacility = (id: string) => ({
  type: DELETE_FACILITY,
  id
});

export const updateFacility = (facility: Facility) => ({
  type: UPDATE_FACILITY,
  facility
});

export const setLoading = (loading: boolean) => ({
  type: SET_LOADING,
  loading
});

export const setError = (error: string | null) => ({
  type: SET_ERROR,
  error
});

// Add process action creators
export const setProcesses = (processes: Process[]) => ({
  type: SET_PROCESSES,
  processes
});

export const addProcess = (process: Process) => ({
  type: ADD_PROCESS,
  process
});

export const updateProcess = (process: Process) => ({
  type: UPDATE_PROCESS,
  process
});

export const deleteProcess = (id: string) => ({
  type: DELETE_PROCESS,
  id
});

export const updateProcessOrder = (processes: Process[]) => ({
  type: UPDATE_PROCESS_ORDER,
  processes
});

export const setDayPlanBOM = (payload: { day: Date }) => ({
  type: SET_DAY_PLAN_BOM,
  payload
});

export const setIsExpanded = (isExpanded: boolean) => ({
  type: SET_IS_EXPANDED,
  isExpanded
});

export const setFilterQuery = (filterQuery: any) => ({
  type: SET_FILTER_QUERY,
  filterQuery
});

export const receivePlanList = (planList: any) => ({
  type: RECEIVE_PLAN_LIST,
  planList
});

export const receiveGantt = (gantt: any) => ({
  type: RECEIVE_GANTT,
  gantt
});

// Thunks
// export const getPlanList = (dates: { start: string; end: string }) => async (dispatch: Dispatch) => {
//   try {
//     const response = await PlanAPIUtil.getPlanList(dates);
//     dispatch(setPlanData(response.data));
//   } catch (error) {
//     console.error('Failed to fetch plan list:', error);
//   }
// };

export const planUpdateState = (payload: { id: string; state: string }) => async (dispatch: Dispatch) => {
  try {
    await PlanAPIUtil.updatePlanState(payload);
  } catch (error) {
    console.error('Failed to update plan state:', error);
  }
};

export const fetchFacilities = (planId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await PlanAPIUtil.getFacilities(planId);
    dispatch(setFacilities(response.data));
  } catch (error) {
    dispatch(setError('Failed to fetch facilities'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createFacility = (planId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await PlanAPIUtil.createFacility(planId);
    dispatch(addFacility(response.data));
  } catch (error) {
    dispatch(setError('Failed to create facility'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateFacilityData = (payload: { id: string; planId: string; [key: string]: any }) => 
  async (dispatch: Dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await PlanAPIUtil.updateFacility(payload);
      dispatch(updateFacility(response.data));
    } catch (error) {
      dispatch(setError('Failed to update facility'));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const removeFacility = (payload: { id: string; planId: string }) => 
  async (dispatch: Dispatch) => {
    try {
      dispatch(setLoading(true));
      await PlanAPIUtil.deleteFacility(payload);
      dispatch(deleteFacility(payload.id));
    } catch (error) {
      dispatch(setError('Failed to delete facility'));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const fetchProcesses = (planId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await PlanAPIUtil.getProcesses(planId);
    dispatch(setProcesses(response.data));
  } catch (error) {
    dispatch(setError('Failed to fetch processes'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const createProcess = (payload: { planId: string; order: number }) => async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await PlanAPIUtil.createProcess(payload.planId);
    dispatch(addProcess(response.data));
  } catch (error) {
    dispatch(setError('Failed to create process'));
  } finally {
    dispatch(setLoading(false));
  }
};

export const updateProcessData = (payload: { id: string; planId: string; [key: string]: any }) => 
  async (dispatch: Dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await PlanAPIUtil.updateProcess(payload);
      dispatch(updateProcess(response.data));
    } catch (error) {
      dispatch(setError('Failed to update process'));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const removeProcess = (payload: { id: string; planId: string }) => 
  async (dispatch: Dispatch) => {
    try {
      dispatch(setLoading(true));
      await PlanAPIUtil.deleteProcess(payload);
      dispatch(deleteProcess(payload.id));
    } catch (error) {
      dispatch(setError('Failed to delete process'));
    } finally {
      dispatch(setLoading(false));
    }
  };

export const updateProcessesOrder = (processes: Process[]) => 
  async (dispatch: Dispatch) => {
    try {
      dispatch(setLoading(true));
      await PlanAPIUtil.updateProcessesOrder(processes);
      dispatch(updateProcessOrder(processes));
    } catch (error) {
      dispatch(setError('Failed to update process order'));
    } finally {
      dispatch(setLoading(false));
    }
  };
export const initializeDates = () => (dispatch: Dispatch) => {
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    dispatch(setDayPlanBOM({
      day: today
    }));
    
  };

export const createPlan = (data: any) => async (dispatch: Dispatch) => {
  const response = await PlanAPIUtil.createPlan(data);
  console.log(response.data);
  dispatch(receivePlanList(response.data));
};

export const getPlanByDate = (date: string) => async (dispatch: Dispatch) => {
  const response = await PlanAPIUtil.getPlanByDate(date);
  dispatch(receivePlanList(response.data));
};

export const getPlanByMonth = (year: string, month: string) => async (dispatch: Dispatch) => {
  const response = await PlanAPIUtil.getPlanByMonth(year, month);
  dispatch(receivePlanList(response.data));
};

export const getGantt = (start: string, end?: string) => async (dispatch: Dispatch) => {
  const response = await PlanAPIUtil.getGantt(start, end);
  dispatch(receiveGantt(response.data));
};

// export const getGanttCalendar = (year: string, month: string) => async (dispatch: Dispatch) => {
//   const response = await PlanAPIUtil.getGanttCalendar(year, month);
//   dispatch(receiveGantt(response.data));
// };

export const createGantt = (data: any) => async (dispatch: Dispatch) => {
  const response = await PlanAPIUtil.createGantt(data);
  getGantt(response.data.start_date, response.data.end_date)(dispatch);
};

export const updateGantt = (data: any) => async (dispatch: Dispatch) => {
  const response = await PlanAPIUtil.updateGantt(data);
  getGantt(response.data.start_date, response.data.end_date)(dispatch);
};

export const deleteGantt = (id: string) => async (dispatch: Dispatch) => {
  const response = await PlanAPIUtil.deleteGantt(id);
  getGantt(response.data.start_date, response.data.end_date)(dispatch);
};

// Reducer
const reducer = (state: PlanState = initialState, action: ActionTypes) => {
  Object.freeze(state);
  const newState = Object.assign({}, state);

  switch (action.type) {
    case SET_PLAN_DATA:
      return {
        ...newState,
        planDatas: action.planData
      };
    case SET_SELECTED_PLAN_ID:
      return {
        ...newState,
        selectedPlanId: action.id
      };
    case SET_SELECTED_PLAN_STATE:
      return {
        ...newState,
        selectedPlanState: action.state
      };
    case SET_SELECTED_PLAN_BOM_STATE:
      return {
        ...newState,
        selectedPlanBomState: action.state
      };
    case SET_FACILITIES:
      return {
        ...newState,
        facilities: action.facilities
      };
    case ADD_FACILITY:
      return {
        ...newState,
        facilities: [...newState.facilities, action.facility]
      };
    case DELETE_FACILITY:
      return {
        ...newState,
        facilities: newState.facilities.filter(facility => facility.id !== action.id)
      };
    case UPDATE_FACILITY:
      return {
        ...newState,
        facilities: newState.facilities.map(facility => facility.id === action.facility.id ? action.facility : facility)
      };
    case SET_LOADING:
      return {
        ...newState,
        loading: action.loading
      };
    case SET_ERROR:
      return {
        ...newState,
        error: action.error
      };
    case SET_DAY_PLAN_BOM:
      return {
        ...newState,
        day_planBOM: action.payload
      };
    case SET_IS_EXPANDED:
      return {
        ...newState,
        isExpanded: action.isExpanded
      };
    case RECEIVE_PLAN_LIST:
      return {
        ...newState,
        planDatas: action.planList
      };
    case RECEIVE_GANTT:
      return {
        ...newState,
        gantt: action.gantt
      };
    case SET_SELECTED_PLAN_ID:
      return {
        ...newState,
        selectedPlanId: action.id
      };
    default:
      return state;
  }
};

export default reducer; 