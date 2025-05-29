import React, {FC} from 'react';
import ErrorPage from "../pages/ErrorPage";
import HeaderComponent from "../components/HeaderComponent";
import {useAuth} from "../context/AuthContext";

const ErrorLayout: FC = () => {
    const {accessToken} = useAuth();
    const isAuthed: boolean = !!accessToken;

    return (
        <div>
            {isAuthed && <HeaderComponent/>}
            <ErrorPage/>
        </div>
    );
};

export default ErrorLayout;