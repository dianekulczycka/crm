import {Navigate, Outlet} from "react-router-dom";
import {FC} from "react";
import {getAccessToken} from "../api/utils/tokenUtil";

const AuthLayout: FC = () => {
    const isAuthed: boolean = !!getAccessToken();
    if (isAuthed) {
        return <Navigate to="/orders" replace/>;
    }
    return <Outlet/>;
};

export default AuthLayout;