
import * as AuthAPIUtil from './api'
import axios from 'axios'
import { saveToLocalStorage } from '../../utils/localStorage'
import ActionTypes from './types'
import { Dispatch } from 'redux'
import { toast } from 'react-hot-toast'

const RECEIVE_AUTH_TOKEN = 'auth/RECEIVE_AUTH_TOKEN'
const CLEAR_AUTH_TOKEN = 'auth/CLEAR_AUTH_TOKEN'
const SET_NEW_PASSWORD = 'auth/SET_NEW_PASSWORD'
const SET_LOGIN_ERROR = 'auth/SET_LOGIN_ERROR'
const SET_REGISTER_ERROR = 'auth/SET_REGISTER_ERROR'

export const receiveAuthToken = (
  token: string,
  // uuid: string,
): ActionTypes => ({
type: RECEIVE_AUTH_TOKEN,
token,
// uuid,
})

export const clearAuthToken = (): ActionTypes => ({
type: CLEAR_AUTH_TOKEN,
})

export const setNewPassword = (error: any): ActionTypes => ({
type: SET_NEW_PASSWORD,
error,
})

export const setLoginError = (error: any): ActionTypes => ({
type: SET_LOGIN_ERROR,
loginError: error,
})

export const setRegisterError = (error: any): ActionTypes => ({
type: SET_REGISTER_ERROR,
registerError: error,
})


export const onReceiveAuthToken = (dispatch: Dispatch, token: string) => {
  saveToLocalStorage('authToken', token)
  // saveToLocalStorage(LOCALSTORAGE_AUTH_TYPE.UUID, data.id)

  axios.defaults.headers.common['Authorization'] = `${token}`

  dispatch(receiveAuthToken(token))

}

export const isLoggedIn = () => {
  const token = localStorage.getItem('authToken')

  if(token) {
    return true;
  }

  return false;
}

export const Login = (username: string, password: string) => (dispatch: Dispatch) => {
  AuthAPIUtil.Login(username, password).then((resp: any) => {
    dispatch(setLoginError(''))
    
    if(resp?.data.code === 400) {
      toast.error("아이디 또는 비밀번호가 일치하지 않습니다.")
      return;
    }

    if (!resp?.data.token) {
      return;
    }

    onReceiveAuthToken(dispatch, resp.data.token)
  })
}

export const Register = (username: string, firstName: string, lastName: string, name: string, password: string, token: string) => (dispatch: Dispatch) => {
  AuthAPIUtil.Register(username, firstName, lastName, name, password, token).then((resp: any) => {
    dispatch(setRegisterError(''))
    if(resp?.code === 400) {
      dispatch(setRegisterError(resp.msg))
      return;
    }
    if (!resp?.data) {
      return;
    }

    if (resp.data.success) {
      // window.location.href = '/email_verification'
    }
    dispatch(setRegisterError(''))
    onReceiveAuthToken(dispatch, resp.data)
  }).catch((err: any) => {
    dispatch(setRegisterError(err.message))
  })
}

export interface IUserState {
  authToken: string
  uuid: string
  setNewPassword: string
  loginError?: string
  registerError?: string
}

export const initialState: IUserState = {
  authToken: '',
  uuid: '',
  setNewPassword: '',
  loginError: '',
  registerError: '',
}

const reducer = (
  state: IUserState = initialState,
  action: ActionTypes
) => {
  Object.freeze(state)
  const newState = Object.assign({}, state)

  switch (action.type) {  
    case RECEIVE_AUTH_TOKEN:
      return {
        ...newState,
        authToken: action.token,
        // uuid: action.uuid,
        authError: null,
    }
  case CLEAR_AUTH_TOKEN:
    return {
      ...newState,
      authToken: '',
    }
  case SET_NEW_PASSWORD: {
    if (action.error && action.error.success) {
      return {
        ...newState,
        setNewPassword: 'OK',
      }
    }
    return {
      ...newState,
      setNewPassword: action.error,
    }
  }
  case SET_LOGIN_ERROR: {
    return {
      ...newState,
      loginError: action.loginError,
    }
  }
  case SET_REGISTER_ERROR: {
    return {
      ...newState,
      registerError: action.registerError,
    }
  }
    default:
      return state
  }
}

export default reducer
