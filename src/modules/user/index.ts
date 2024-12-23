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
const RECEIVE_USER_LIST = 'user/RECEIVE_USER_LIST'
const RECEIVE_USER_BY_NAME = 'user/RECEIVE_USER_BY_NAME'

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

export const receiveUserList = (userList: any): ActionTypes => ({
type: RECEIVE_USER_LIST,
userList,
})

export const receiveUserByName = (user: any): ActionTypes => ({
type: RECEIVE_USER_BY_NAME,
user,
})

export const onReceiveAuthToken = (dispatch: Dispatch, token: string) => {
  saveToLocalStorage('authToken', token)
  // saveToLocalStorage(LOCALSTORAGE_AUTH_TYPE.UUID, data.id)
  // console.log(token)
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
    console.log(resp)
    dispatch(setLoginError(''))
    
    if(resp?.data.code === 400) {
      toast.error("아이디 또는 비밀번호가 일치하지 않습니다.")
      return;
    }

    if (!resp?.data.access_token) {
      return;
    }
    
    onReceiveAuthToken(dispatch, resp.data.access_token)

    window.location.href = '/information'
  })
}

export const Register = (user_id: string, pass_word: string, name: string, email: string) => (dispatch: Dispatch) => {
  AuthAPIUtil.Register(user_id, pass_word, name, email).then((resp: any) => {
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
      // 회원가입 완료 후 로그인 페이지로 이동
      window.location.href = '/login';
    }
    dispatch(setRegisterError(''))
    onReceiveAuthToken(dispatch, resp.data)
  }).catch((err: any) => {
    dispatch(setRegisterError(err.message))
  })
}

export const GetUserList = () => (dispatch: Dispatch) => {
  AuthAPIUtil.GetUserList().then((resp: any) => {
    dispatch(receiveUserList(resp.data))
  })
}

export const GetUserByName = (name: string) => (dispatch: Dispatch) => {
  AuthAPIUtil.GetUserByName(name).then((resp: any) => {
    dispatch(receiveUserByName(resp.data))
  })
}

export const DeleteUser = (id: string) => (dispatch: Dispatch) => {
  AuthAPIUtil.DeleteUser(id).then(() => {
    GetUserList()(dispatch)
  })
}

export const UpdateUser = (id: string, user_id: string, pass_word: string, name: string, email: string, role: string) => (dispatch: Dispatch) => {
  AuthAPIUtil.UpdateUser(id, user_id, pass_word, name, email, role).then(() => {
    GetUserList()(dispatch)
  })
}

export const CreateUser = (user_id: string, pass_word: string, name: string, email: string, role: string) => (dispatch: Dispatch) => {
  AuthAPIUtil.CreateUser(user_id, pass_word, name, email, role).then(() => {
    GetUserList()(dispatch)
  })
}


export interface IUserState {
  authToken: string
  uuid: string
  setNewPassword: string
  loginError?: string
  registerError?: string
  userList: any
  user: any
}

export const initialState: IUserState = {
  authToken: '',
  uuid: '',
  setNewPassword: '',
  loginError: '',
  registerError: '',
  userList: [],
  user: null,
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
  case RECEIVE_USER_LIST: {
    return {
      ...newState,
      userList: action.userList,
    }
  }
  case RECEIVE_USER_BY_NAME: {
    return {
      ...newState,
      user: action.user,
    }
  }
    default:
      return state
  }
}

export default reducer
