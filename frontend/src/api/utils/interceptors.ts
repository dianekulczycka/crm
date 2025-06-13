import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import {getAccessToken, logout} from "./tokenUtil";
import {refreshAccessToken} from "../authService";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "",
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        const status = error.response?.status;
        const data = error.response?.data;

        const msg =
            typeof data === "string"
                ? data
                : (data as { msg?: string })?.msg || "unauthed or banned";

        console.warn(msg);

        if (msg === "Account banned") {
            logout();
            return Promise.reject(error);
        }

        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                    return axios(originalRequest);
                }
            } catch (refreshError: any) {
                logout();
                return Promise.reject(refreshError);
            }
        }

        if (status === 401) logout();
        return Promise.reject(error);
    }
);

export default axiosInstance;