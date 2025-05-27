import {Navigate, Outlet} from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import {FC} from "react";
import {getAccessToken} from "../api/utils/tokenUtil";

const MainLayout: FC = () => {
    const isAuthed: boolean = !!getAccessToken();

    if (!isAuthed) {
        return <Navigate to="/login" replace/>;
    }

    return (
        <div>
            <HeaderComponent/>
            <Outlet/>
        </div>
    );
};

export default MainLayout;