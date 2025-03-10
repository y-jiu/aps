import axios from 'axios'
import { loadFromLocalStorage } from './localStorage';
// import { LOCALSTORAGE_AUTH_TYPE } from '../constants/localStorage';

export const baseURL = 'http://115.145.177.104:1829/'

export const axiosJSON = axios.create({
  baseURL: baseURL,
  timeout: 100000,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
})

axiosJSON.interceptors.request.use(
  (config) => {
    if (loadFromLocalStorage('authToken')){
      config.headers['Authorization'] = `Bearer ${loadFromLocalStorage('authToken')}`
      return config
    } else {
      return config
    }
  },
  (error) => Promise.reject(error),
)

axiosJSON.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);
