import axios, {AxiosResponse} from "axios";
import {IComment} from "../interfaces/comment/IComment";
import {BASE_URL} from "./consts";
import {getAccessToken} from "./tokenService";

export const getAllComments = async (orderId: number): Promise<IComment[]> => {
    try {
        const response: AxiosResponse<IComment[]> = await axios.get(`${BASE_URL}/orders/${orderId}/comments/`, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching comments", error);
        return [];
    }
};

export const addComment = async (orderId: number, body: string): Promise<IComment> => {
    try {
        const response: AxiosResponse<IComment> = await axios.post(
            `${BASE_URL}/orders/${orderId}/comments/`,
            {body},
            {headers: {Authorization: `Bearer ${getAccessToken()}`}}
        );
        return response.data;
    } catch (error) {
        console.error("Error submit comment", error);
        throw error;
    }
};

