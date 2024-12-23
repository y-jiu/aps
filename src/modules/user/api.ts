import { axiosJSON } from "../../utils/axios";

export const Login = (username: string, password: string) => {
  return axiosJSON.post('auth/login', {
    username,
    password
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}

export const Register = (user_id: string, pass_word: string, name: string, email: string) => {
  return axiosJSON.post('auth/signup', {
    user_id,
    pass_word,
    name,
    email
  })
}

export const CreateUser = (user_id: string, pass_word: string, name: string, email: string, role: string) => {
  return axiosJSON.post('user', {
    user_id,
    pass_word,
    name,
    email,
    role
  })
}

export const GetUserList = () => {
  return axiosJSON.get('user')
}

export const GetUserByName = (name: string) => {
  return axiosJSON.get(`user/name?name=${name}`)
}

export const DeleteUser = (id: string) => {
  return axiosJSON.delete(`user/${id}`)
}

export const UpdateUser = (id: string, user_id: string, pass_word: string, name: string, email: string, role: string) => {
  return axiosJSON.put(`user`, {
    id,
    user_id,
    pass_word,
    name,
    email,
    role
  })
}