import React, {FC} from 'react';
import ErrorPage from "../pages/ErrorPage";
import HeaderComponent from "../components/HeaderComponent";
import {getAccessToken} from "../services/tokenService";

const ErrorLayout: FC = () => {
    const isAuthed: boolean = !!getAccessToken();

    return (
        <div>
            {isAuthed && <HeaderComponent/>}
            <ErrorPage/>
        </div>
    );
};

export default ErrorLayout;