import axios, {AxiosResponse} from "axios";
import {getAccessToken} from "./tokenService";
import {refreshAccessToken} from "./authService";
import {BASE_URL} from "./consts";
import {IPaginationResponse} from "../interfaces/pagination/IPaginationResponse";
import {IOrder} from "../interfaces/order/IOrder";
import {ISearchParams} from "../interfaces/order/ISearchParams";
import {IStat} from "../interfaces/order/IStat";

axios.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axios.interceptors.response.use(
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

export const getAllOrders = async (params: ISearchParams): Promise<IPaginationResponse<IOrder>> => {
    try {
        const response: AxiosResponse<IPaginationResponse<IOrder>> = await axios.get(
            `${BASE_URL}/orders/`,
            {
                params,
                headers: {"Content-Type": "application/json",},});
        return response.data;
    } catch (error) {
        console.error("Failed to get orders", error);
        throw error;
    }
};

export const getAllGroupNames = async (): Promise<string[]> => {
    try {
        const response: AxiosResponse<string[]> = await axios.get(`${BASE_URL}/groups/`);
        return response.data;
    } catch (error) {
        console.error("Failed to get group names", error);
        throw error;
    }
};

export const getStats = async (): Promise<IStat[]> => {
    try {
        const response: AxiosResponse<IStat[]> = await axios.get(`${BASE_URL}/orders/stats`);
        return response.data;
    } catch (error) {
        console.error("Failed to get order stats", error);
        throw error;
    }
};

export const editOrder = async (id: number, data: Partial<IOrder>): Promise<void> => {
    try {
        await axios.patch(`${BASE_URL}/orders/order/${id}`, data, {
            headers: {"Content-Type": "application/json",},
        });
    } catch (error) {
        console.error("Error editing order", error);
        throw error;
    }
};

export const getExcel = async (params: Partial<ISearchParams>): Promise<Blob> => {
    try {
        const response: AxiosResponse<Blob> = await axios.post(
            `${BASE_URL}/orders/excel`,
            params,
            {
                responseType: "blob",
                headers: {"Content-Type": "application/json",},
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error getting Excel", error);
        throw error;
    }
};