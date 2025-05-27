import {createBrowserRouter, RouteObject} from 'react-router-dom';
import MainLayout from "../layouts/MainLayout";
import ErrorLayout from "../layouts/ErrorLayout";
import OrdersPage from "../pages/OrdersPage";
import AuthPage from "../pages/AuthPage";
import AuthLayout from "../layouts/AuthLayout";
import CPanelPage from "../pages/CPanelPage";
import PasswordPage from "../pages/PasswordPage";

const routes: RouteObject[] = [
    {
        path: "/",
        element: <AuthLayout/>,
        errorElement: <ErrorLayout/>,
        children: [
            {index: true, element: <AuthPage/>},
            {path: "login", element: <AuthPage/>},
        ],
    },
    {
        path: "/",
        element: <MainLayout/>,
        errorElement: <ErrorLayout/>,
        children: [
            {path: "orders", element: <OrdersPage/>},
            {path: "cpanel", element: <CPanelPage/>},
            {path: "activate/:token", element: <PasswordPage/>},
        ],
    },
];

export const router = createBrowserRouter(routes);