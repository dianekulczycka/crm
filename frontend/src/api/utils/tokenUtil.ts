import {jwtDecode} from "jwt-decode";

interface IJwtPayload {
    roles: string[];
    sub: string;
    iat: number;
    exp: number;

    [key: string]: any;
}

export const getUserDataFromToken = (token: string): { email: string; role: string | null } => {
    if (!token) return {email: "", role: null};
    const decoded = jwtDecode<IJwtPayload>(token);
    const email = decoded.sub ?? "";
    const role = decoded.roles && decoded.roles.length > 0 ? decoded.roles[0] : null;
    return {email, role};
}

export const logout = () => {
    localStorage.clear();
    window.location.href = "/";
};

export const getAccessToken = (): string | null => localStorage.getItem("accessToken");
export const getRefreshToken = (): string | null => localStorage.getItem("refreshToken");
export const getUserName = (): string | null => localStorage.getItem("username");

export const setAccessToken = (token: string): void => {
    localStorage.setItem("accessToken", token);
};

export const setRefreshToken = (token: string): void => {
    localStorage.setItem("refreshToken", token);
};

export const setUserName = (username: string): void => {
    localStorage.setItem("username", username);
};


