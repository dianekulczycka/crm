import {FC, useState} from "react";
import {IStat} from "../../interfaces/order/IStat";
import {SubmitHandler, useForm} from "react-hook-form";
import {CreateManagerModalComponent} from "../modals/CreateManagerModalComponent";
import {ICreateManagerRequest} from "../../interfaces/manager/ICreateManagerRequest";
import {addManager} from "../../services/managerService";
import OrdersStatsComponent from "./order stats/OrdersStatsComponent";
import {IManager} from "../../interfaces/manager/IManager";
import ManagersListComponent from "./manager list/ManagersListComponent";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

interface IProps {
    stats: IStat[];
    managers: IManager[];
}

const CPanelComponent: FC<IProps> = ({stats, managers}) => {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);

    const {
        control,
        handleSubmit,
        reset
    } = useForm<ICreateManagerRequest>({});

    const onSubmit: SubmitHandler<ICreateManagerRequest> = (data) => {
        addManager(data)
            .then(() => {
                setModalOpen(false);
                reset();
                navigate(0);
            })
    };

    const onClose = () => {
        setModalOpen(false);
        reset();
    };

    return (
        <div className="d-flex flex-column align-items-start w-100">
            <OrdersStatsComponent stats={stats}/>
            <Button className="btn btn-success mx-5 fs-4" onClick={() => setModalOpen(true)}>
                Create manager
            </Button>
            <ManagersListComponent managers={managers}/>
            <CreateManagerModalComponent
                isOpen={isModalOpen}
                onClose={onClose}
                onSubmit={handleSubmit(onSubmit)}
                control={control}
            />
        </div>
    );
};

export default CPanelComponent;