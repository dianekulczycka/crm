import {AxiosResponse} from "axios";
import {BASE_URL} from "./utils/consts";
import {ICreateManagerRequest} from "../interfaces/manager/ICreateManagerRequest";
import {IManager} from "../interfaces/manager/IManager";
import {IPaginationResponse} from "../interfaces/pagination/IPaginationResponse";
import {ISearchParams} from "../interfaces/order/ISearchParams";
import axiosInstance from "./utils/interceptors";

export const getManagers = async (params: ISearchParams): Promise<IPaginationResponse<IManager>> => {
    try {
        const response: AxiosResponse<IPaginationResponse<IManager>> = await axiosInstance.get(`${BASE_URL}/managers`, {params});
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to fetch managers");
    }
};

export const addManager = async (data: ICreateManagerRequest): Promise<void> => {
    try {
        const response: AxiosResponse<void> = await axiosInstance.post(
            `${BASE_URL}/managers/create`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to add manager");
    }
};

export const toggleBanStatus = async (id: number): Promise<void> => {
    try {
        const response: AxiosResponse<void> = await axiosInstance.put(`${BASE_URL}/managers/ban/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to toggle manager ban");
    }
};
