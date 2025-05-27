import {AxiosResponse} from "axios";
import {IComment} from "../interfaces/comment/IComment";
import {BASE_URL} from "./utils/consts";
import axiosInstance from "./utils/interceptors";

export const getAllComments = async (orderId: number): Promise<IComment[]> => {
    try {
        const response: AxiosResponse<IComment[]> = await axiosInstance.get(`${BASE_URL}/orders/${orderId}/comments/`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to load comments");
    }
};

export const addComment = async (orderId: number, body: string): Promise<IComment> => {
    try {
        const response: AxiosResponse<IComment> = await axiosInstance.post(
            `${BASE_URL}/orders/${orderId}/comments/`,
            {body}
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to add comment");
    }
};

