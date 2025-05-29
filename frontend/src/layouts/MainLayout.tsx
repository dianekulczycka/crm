import {Navigate, Outlet} from "react-router-dom";
import HeaderComponent from "../components/HeaderComponent";
import {FC} from "react";
import {useAuth} from "../context/AuthContext";

const MainLayout: FC = () => {
    const {accessToken} = useAuth();
    const isAuthed: boolean = !!accessToken;

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