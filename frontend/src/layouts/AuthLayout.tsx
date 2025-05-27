import React, {FC} from "react";
import {Outlet} from "react-router-dom";
import {getAccessToken} from "../services/tokenService";

const AuthLayout: FC = () => {
    const isAuthed: boolean = !!getAccessToken();

    return (
        <>
            {!isAuthed && <Outlet/>}
        </>
    );
};

export default AuthLayout;