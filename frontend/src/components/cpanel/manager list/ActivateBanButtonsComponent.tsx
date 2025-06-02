import React, {FC, useState} from "react";
import {IManager} from "../../../interfaces/manager/IManager";
import {Button} from "react-bootstrap";
import {toggleBanStatus} from "../../../api/managerService";
import {requestPasswordToken} from "../../../api/authService";
import ErrorComponent from "../../ErrorComponent";

interface IProps {
    manager: IManager;
    refreshManagers: () => void;
}

export const ActivateBanButtonsComponent: FC<IProps> = ({manager, refreshManagers}) => {
    const [error, setError] = useState<string | null>(null);

    const toggleBan = () => {
        toggleBanStatus(manager.id)
            .then(() => {
                refreshManagers();
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const onSetPassword = () => {
        requestPasswordToken(manager.id)
            .then((link) => {
                return navigator.clipboard.writeText(`http://localhost:3000/activate/${link}`);
            })
            .then(() => {
                alert("Link was copied");
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <div className="d-flex flex-column justify-content-evenly">
            <ErrorComponent error={error} />
            <Button className="btn btn-success mx-3 fs-4"
                    onClick={onSetPassword}>{manager.isActive ? "recover pass" : "activate"}</Button>
            <Button className="btn btn-success mx-3 fs-4" onClick={toggleBan} disabled={manager.isBanned}>ban</Button>
            <Button className="btn btn-success mx-3 fs-4" onClick={toggleBan}
                    disabled={!manager.isBanned}>unban</Button>
        </div>
    );
};

export default ActivateBanButtonsComponent;