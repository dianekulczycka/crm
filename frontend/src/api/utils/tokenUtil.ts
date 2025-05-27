export const getAccessToken = (): string | null => localStorage.getItem("accessToken");
export const getRefreshToken = (): string | null => localStorage.getItem("refreshToken");
export const getUserName = (): string | null => localStorage.getItem("userName");
export const getUserRole = (): string | null => localStorage.getItem("userRole");

export const setAccessToken = (token: string): void => {
    localStorage.setItem("accessToken", token);
};

export const setRefreshToken = (token: string): void => {
    localStorage.setItem("refreshToken", token);
};

export const setUserName = (userName: string): void => {
    localStorage.setItem("userName", userName);
};

export const setUserRole = (userRole: string): void => {
    localStorage.setItem("userRole", userRole);
};

