import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {IAuthResponse} from "../interfaces/auth/IAuthResponse";

interface AuthServiceType {
    login: (data: IAuthResponse) => void;
    updateAccessToken: (token: string) => void;
    getRefreshToken: () => string | null;
    getAccessToken: () => string | null;
}

export let authService: AuthServiceType | undefined;

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    userName: string | null;
    userRole: string | null;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUserName(null);
        setUserRole(null);
    };

    const login = (data: IAuthResponse) => {
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        setUserName(data.name);
        setUserRole(data.role);
    };

    const updateAccessToken = (token: string) => {
        setAccessToken(token);
    };

    useEffect(() => {
        authService = {
            login,
            updateAccessToken,
            getRefreshToken: () => refreshToken,
            getAccessToken: () => accessToken,
        };
    }, [accessToken, refreshToken]);

    return (
        <AuthContext.Provider value={{accessToken, refreshToken, userName, userRole, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};