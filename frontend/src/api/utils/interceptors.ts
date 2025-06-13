import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import {IErrorResponse} from "../../interfaces/error/IErrorResponse";
import {getAccessToken, logout} from "./tokenUtil";
import {refreshAccessToken} from "../authService";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "",
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
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
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axios(originalRequest);
                }
            } catch (err: any) {
                const msg = err.response?.data?.msg || "error, something went wrong";
                console.warn(msg);
                logout();
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => res,
    (err: AxiosError<IErrorResponse>) => {
        const msg = err.response?.data?.msg || "error, something went wrong";
        console.warn(msg);
        return Promise.reject(err);
    }
);

axiosInstance.interceptors.response.use(
    (res: AxiosResponse) => res,
    (err) => {
        const msg = err.response?.data;
        console.warn(msg);
        if (msg === "Account banned") {
            logout();
        }
        return Promise.reject(err);
    }
);

export default axiosInstance;