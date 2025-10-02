import { api, baseURL } from ".";
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

        // Only proceed if 401 and not refresh endpoint
        if (error.response?.status === 401 && originalRequest.url !== '/auth/refresh') {
            originalRequest._isRetry = true;

            const promise = new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            });

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true }); // backend sets cookies

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
