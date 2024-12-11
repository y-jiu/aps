// Action types
export interface Facility {
  id: string;
  name: string;
  note: string;
}

export interface FacilityState {
  facilities: Facility[];
  loading: boolean;
  error: string | null;
}

export interface Process {
  id: string;
  name: string;
  order: number;
  note: string;
}

export interface ProcessState {
  processes: Process[];
  loading: boolean;
  error: string | null;
}


interface ISetPlanData {
  readonly type: 'plan/SET_PLAN_DATA'
  readonly planData: any
}

interface ISetSelectedPlanId {
  readonly type: 'plan/SET_SELECTED_PLAN_ID'
  readonly id: string
}

interface ISetSelectedPlanState {
  readonly type: 'plan/SET_SELECTED_PLAN_STATE'
  readonly state: string
}

interface ISetSelectedPlanBomState {
  readonly type: 'plan/SET_SELECTED_PLAN_BOM_STATE'
  readonly state: string
}

interface ISetFacilities {
  readonly type: 'plan/SET_FACILITIES'
  readonly facilities: Facility[]
}

interface IAddFacility {
  readonly type: 'plan/ADD_FACILITY'
  readonly facility: Facility
}

interface IDeleteFacility {
  readonly type: 'plan/DELETE_FACILITY'
  readonly id: string
}

interface IUpdateFacility {
  readonly type: 'plan/UPDATE_FACILITY'
  readonly facility: Facility
}

interface ISetLoading {
  readonly type: 'plan/SET_LOADING'
  readonly loading: boolean
}

interface ISetError {
  readonly type: 'plan/SET_ERROR'
  readonly error: string | null
}

// Add Process action types
interface ISetProcesses {
  readonly type: 'plan/SET_PROCESSES'
  readonly processes: Process[]
}

interface IAddProcess {
  readonly type: 'plan/ADD_PROCESS'
  readonly process: Process
}

interface IUpdateProcess {
  readonly type: 'plan/UPDATE_PROCESS'
  readonly process: Process
}

interface IDeleteProcess {
  readonly type: 'plan/DELETE_PROCESS'
  readonly id: string
}

interface IUpdateProcessOrder {
  readonly type: 'plan/UPDATE_PROCESS_ORDER'
  readonly processes: Process[]
}

interface ISetDayPlanBOM {
  readonly type: 'plan/SET_DAY_PLAN_BOM'
  readonly payload: { startDay: Date; endDay: Date }
}

interface ISetIsExpanded {
  readonly type: 'plan/SET_IS_EXPANDED'
  readonly isExpanded: boolean
}

interface ISetFilterQuery {
  readonly type: 'plan/SET_FILTER_QUERY'
  readonly filterQuery: any
}

type ActionTypes = 
ISetPlanData 
| ISetSelectedPlanId 
| ISetSelectedPlanState 
| ISetSelectedPlanBomState 
| ISetFacilities 
| IAddFacility 
| IDeleteFacility 
| IUpdateFacility 
| ISetLoading 
| ISetError 
| ISetProcesses 
| IAddProcess 
| IUpdateProcess 
| IDeleteProcess 
| IUpdateProcessOrder
| ISetDayPlanBOM
| ISetIsExpanded
| ISetFilterQuery
export default ActionTypes
