import {Navigate, Outlet} from "react-router-dom";
import {FC} from "react";
import {useAuth} from "../context/AuthContext";

const AuthLayout: FC = () => {
    const {accessToken} = useAuth();
    const isAuthed: boolean = !!accessToken;
    if (isAuthed) {
        return <Navigate to="/orders" replace/>;
    }
    return <Outlet/>;
};

export default AuthLayout;