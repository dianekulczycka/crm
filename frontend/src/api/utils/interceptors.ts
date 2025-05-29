import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {authService} from "../../context/AuthContext";
import {refreshAccessToken} from "../authService";
import {IErrorResponse} from "../../interfaces/error/IErrorResponse";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "",
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = authService?.getAccessToken?.();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError<IErrorResponse>): Promise<AxiosResponse | Promise<never>> => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken: string = await refreshAccessToken();
                if (newAccessToken) {
                    originalRequest.headers = {
                        ...originalRequest.headers,
                        Authorization: `Bearer ${newAccessToken}`,
                    };
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                return Promise.reject(refreshError);
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