import {FC} from "react";
import {useNavigate} from "react-router-dom";
import {IManager} from "../../../interfaces/manager/IManager";
import {Button} from "react-bootstrap";
import {toggleBanStatus} from "../../../services/managerService";
import {requestPasswordToken} from "../../../services/authService";

interface IProps {
    manager: IManager;
}

export const ActivateBanButtonsComponent: FC<IProps> = ({manager}) => {
    const navigate = useNavigate();

    const toggleBan = () => {
        toggleBanStatus(manager.id).then(() => navigate(0));
    };

    const onSetPassword = () => {
        requestPasswordToken(manager.id)
            .then((link) => {
                return navigator.clipboard.writeText(`http://localhost:3000/activate/${link}`);
            })
            .then(() => {
                alert("Link was copied");
            })
    };


    return (
        <div className="d-flex flex-column justify-content-evenly">
            <Button className="btn btn-success mx-3 fs-4"
                    onClick={onSetPassword}>{manager.isActive ? "recover pass" : "activate"}</Button>
            <Button className="btn btn-success mx-3 fs-4" onClick={toggleBan} disabled={manager.isBanned}>ban</Button>
            <Button className="btn btn-success mx-3 fs-4" onClick={toggleBan} disabled={!manager.isBanned}>unban</Button>
        </div>
    );
};

export default ActivateBanButtonsComponent;