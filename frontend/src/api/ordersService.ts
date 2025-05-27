import {AxiosResponse} from "axios";
import {BASE_URL} from "./utils/consts";
import {IPaginationResponse} from "../interfaces/pagination/IPaginationResponse";
import {IOrder} from "../interfaces/order/IOrder";
import {ISearchParams} from "../interfaces/order/ISearchParams";
import {IStat} from "../interfaces/order/IStat";
import axiosInstance from "./utils/interceptors";

export const getAllOrders = async (params: ISearchParams): Promise<IPaginationResponse<IOrder>> => {
    try {
        const response: AxiosResponse<IPaginationResponse<IOrder>> = await axiosInstance.get(
            `${BASE_URL}/orders/`,
            {
                params,
                headers: {"Content-Type": "application/json",},
            });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to load orders");
    }
};

export const getAllGroupNames = async (): Promise<string[]> => {
    try {
        const response: AxiosResponse<string[]> = await axiosInstance.get(`${BASE_URL}/groups/`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to load group names");
    }
};

export const getStats = async (): Promise<IStat[]> => {
    try {
        const response: AxiosResponse<IStat[]> = await axiosInstance.get(`${BASE_URL}/orders/stats`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to load orders stats");
    }
};

export const editOrder = async (id: number, data: Partial<IOrder>): Promise<void> => {
    try {
        await axiosInstance.patch(`${BASE_URL}/orders/order/${id}`, data, {
            headers: {"Content-Type": "application/json",},
        });
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to edit order");
    }
};

export const getExcel = async (params: Partial<ISearchParams>): Promise<Blob> => {
    try {
        const response: AxiosResponse<Blob> = await axiosInstance.post(
            `${BASE_URL}/orders/excel`,
            params,
            {
                responseType: "blob",
                headers: {"Content-Type": "application/json",},
            }
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to load excel");
    }
};