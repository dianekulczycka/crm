import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import {IErrorResponse} from "../../interfaces/error/IErrorResponse";
import {getAccessToken} from "./tokenUtil";
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
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axios(originalRequest);
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

export default axiosInstance;