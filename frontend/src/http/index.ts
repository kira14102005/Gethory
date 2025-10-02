import axios from 'axios'
import type { ActivateState } from '../store/activateSlice';
export const baseURL = import.meta.env.VITE_BACKEND_URL;
export const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
})

export const sendVerificationCode = (data: string | null) => {
  return api.post(`/auth/email/verify?code=${data}`)
}

export const activate = async (currentActiveState: ActivateState) => {
  const res = await api.put('/user/update_profile', currentActiveState);
  return res
}
export const getAvatarImage = (path: string) => {
  const url = baseURL + '/storage/' + path;
  return url
}
import { store } from "../store";
import { clearActivate } from "../store/activateSlice";
import { clearUser } from "../store/authSlice";

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (error: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,

  async error => {
    const originalRequest = error.config;

    if (originalRequest._isRetry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && originalRequest.url !== '/auth/refresh') {
      originalRequest._isRetry = true;

      const promise = new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true }); //usual new axios request so that no Recursove loop of interceptors begin

          isRefreshing = false;
          processQueue(null, 'RENEWED');

          return api(originalRequest);
        } catch (refreshError: any) {
          isRefreshing = false;
          processQueue(refreshError, null);

          store.dispatch(clearUser());
          store.dispatch(clearActivate());
          window.location.href = '/signin';

          return Promise.reject(refreshError);
        }
      }

      return promise.then(() => api(originalRequest));
    }

    return Promise.reject(error);
  }
);
