import React, {FC} from 'react';
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import {getUserName, getUserRole, logout} from "../api/utils/tokenUtil";

const HeaderComponent: FC = () => {
    const username = getUserName();
    const role = getUserRole();
    const isAdmin = role === "ROLE_ADMIN";

    return (
        <div className="d-flex justify-content-end align-items-center bg-success-subtle shadow-sm">
            <ul className="d-flex flex-row align-items-center w-auto list-unstyled mb-0">
                <li className="pe-2 ps-2">
                    <p className="fs-5 m-auto">Current user: {username} </p>
                </li>
                {
                    isAdmin &&
                    <li>
                        <Link to="/cpanel" className="btn btn-success m-2 fs-6">cPanel</Link>
                    </li>
                }
                <li>
                    <Button className="btn btn-success m-2 fs-6" onClick={logout}>Log out</Button>
                </li>
            </ul>
        </div>
    );
};

export default HeaderComponent;
