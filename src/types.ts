import { IDashboardState } from './modules/dashboard'
import { ISalesState } from './modules/sales'
import { PlanState } from './modules/plan'
import { IUserState } from './modules/user'

export interface IAppState {
  dashboard: IDashboardState
  sales: ISalesState
  plan: PlanState
  user: IUserState
}