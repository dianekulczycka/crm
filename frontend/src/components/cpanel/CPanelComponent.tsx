import React, {FC, useState} from "react";
import {IStat} from "../../interfaces/order/IStat";
import {SubmitHandler, useForm} from "react-hook-form";
import {CreateManagerModalComponent} from "../modals/CreateManagerModalComponent";
import {ICreateManagerRequest} from "../../interfaces/manager/ICreateManagerRequest";
import {addManager} from "../../api/managerService";
import OrdersStatsComponent from "./order stats/OrdersStatsComponent";
import {IManager} from "../../interfaces/manager/IManager";
import ManagersListComponent from "./manager list/ManagersListComponent";
import {Button} from "react-bootstrap";

interface IProps {
    stats: IStat[];
    managers: IManager[];
    refreshManagers: () => void;
}

const CPanelComponent: FC<IProps> = ({stats, managers, refreshManagers}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                refreshManagers();
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    const onClose = () => {
        setModalOpen(false);
    };

    return (
        <div className="d-flex flex-column align-items-start w-100">
            <OrdersStatsComponent stats={stats}/>
            <Button className="btn btn-success mx-5 fs-4" onClick={() => setModalOpen(true)}>
                Create manager
            </Button>
            <ManagersListComponent refreshManagers={refreshManagers} managers={managers}/>
            <CreateManagerModalComponent
                isOpen={isModalOpen}
                onClose={onClose}
                onSubmit={handleSubmit(onSubmit)}
                control={control}
                error={error}
            />
        </div>
    );
};

export default CPanelComponent;