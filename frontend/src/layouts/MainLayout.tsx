import React, {FC} from 'react';
import {Outlet} from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import {getAccessToken} from "../services/tokenService";

const MainLayout: FC = () => {
    const isAuthed: boolean = !!getAccessToken();

    return (
        <div>
            {
                isAuthed &&
                <>
                    <HeaderComponent/>
                    <Outlet/>
                </>
            }
        </div>
    );
};

export default MainLayout;