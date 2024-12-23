import { IDashboardState } from './modules/dashboard'
import { ISalesState } from './modules/sales'
import { PlanState } from './modules/plan'
import { IUserState } from './modules/user'
import { IInformationState } from './modules/information'
import { IDeliveryState } from './modules/delivery'
export interface IAppState {
  dashboard: IDashboardState
  sales: ISalesState
  plan: PlanState
  user: IUserState
  information: IInformationState
  delivery: IDeliveryState
}