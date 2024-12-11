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

export const Register = (username: string, firstName: string, lastName: string, name: string, password: string, token: string) => {
  return axiosJSON.post(`auth/register`, {
    username,
    password,
    firstName,
    lastName,
    name,
    token
  })
}
