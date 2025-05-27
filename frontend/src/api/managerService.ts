import axios, {AxiosResponse} from "axios";
import {BASE_URL} from "./consts";
import {ICreateManagerRequest} from "../interfaces/manager/ICreateManagerRequest";
import {IManager} from "../interfaces/manager/IManager";
import {getAccessToken} from "./tokenService";
import {IPaginationResponse} from "../interfaces/pagination/IPaginationResponse";
import {ISearchParams} from "../interfaces/order/ISearchParams";

export const getManagers = async (params: ISearchParams): Promise<IPaginationResponse<IManager>> => {
    try {
        const response: AxiosResponse<IPaginationResponse<IManager>> = await axios.get(`${BASE_URL}/managers`, {
            params,
            headers: {Authorization: `Bearer ${getAccessToken()}`}
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching managers", error);
        throw error;
    }
};

export const addManager = async (data: ICreateManagerRequest): Promise<void> => {
    try {
        const response: AxiosResponse<void> = await axios.post(
            `${BASE_URL}/managers/create`,
            data,
            {headers: {Authorization: `Bearer ${getAccessToken()}`}}
        );
        return response.data;
    } catch (error) {
        console.error("Error creating manager", error);
        throw error;
    }
};

export const toggleBanStatus = async (id: number): Promise<void> => {
    try {
        const response: AxiosResponse<void> = await axios.put(`${BASE_URL}/managers/ban/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error banning manager", error);
        throw error;
    }
};

