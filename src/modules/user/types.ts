// Action types

interface IReceiveAuthToken {
  readonly type: 'auth/RECEIVE_AUTH_TOKEN'
  readonly token: string
  // readonly uuid: string
}
interface IClearAuthToken {
  readonly type: 'auth/CLEAR_AUTH_TOKEN'
}
interface ISetNewPassword {
  readonly type: 'auth/SET_NEW_PASSWORD'
  readonly error: any
}
interface ISetLoginError {
  readonly type: 'auth/SET_LOGIN_ERROR'
  readonly loginError: string
}
interface ISetRegisterError {
  readonly type: 'auth/SET_REGISTER_ERROR'
  readonly registerError: string
}

interface IReceiveUserList {
  readonly type: 'user/RECEIVE_USER_LIST'
  readonly userList: any
}

interface IReceiveUserByName {
  readonly type: 'user/RECEIVE_USER_BY_NAME'
  readonly user: any
}

type ActionTypes =
  | IReceiveAuthToken
  | IClearAuthToken
  | ISetNewPassword
  | ISetLoginError
  | ISetRegisterError
  | IReceiveUserList
  | IReceiveUserByName

export default ActionTypes
