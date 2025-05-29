import {AxiosResponse} from "axios";
import {IAuthResponse} from "../interfaces/auth/IAuthResponse";
import {IAuthRequest} from "../interfaces/auth/IAuthRequest";
import {BASE_URL} from "./utils/consts";
import {IPasswordUpdate} from "../interfaces/auth/IPasswordUpdate";
import axiosInstance from "./utils/interceptors";
import {authService} from "../context/AuthContext";

export const logIn = async (authData: IAuthRequest): Promise<void> => {
    try {
        const response: AxiosResponse<IAuthResponse> = await axiosInstance.post(
            `${BASE_URL}/auth/login`,
            authData,
            { headers: { "Content-Type": "application/json" } }
        );
        authService!.login(response.data);
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "log in failed");
    }
};

export const refreshAccessToken = async (): Promise<string> => {
    const refreshToken = authService!.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    try {
        const response: AxiosResponse<IAuthResponse> = await axiosInstance.post(
            `/auth/refresh-token`,
            {refreshToken},
            {headers: {"Content-Type": "application/json"}}
        );
        authService!.updateAccessToken(response.data.accessToken);
        return response.data.accessToken;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "token refresh failed");
    }
};

export const requestPasswordToken = async (managerId: number): Promise<string> => {
    try {
        const response: AxiosResponse<string> = await axiosInstance.post(
            `${BASE_URL}/auth/setPassword/id/${managerId}`
        );
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to request token");
    }
};

export const setManagerPassword = async (token: string, request: IPasswordUpdate): Promise<void> => {
    try {
        await axiosInstance.post(
            `${BASE_URL}/auth/setPassword/${token}`,
            request,
            {headers: {"Content-Type": "application/json"}}
        );
    } catch (error: any) {
        throw new Error(error.response?.data?.msg || "failed to set password");
    }
};