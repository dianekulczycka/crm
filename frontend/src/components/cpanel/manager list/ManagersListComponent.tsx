import React, {FC} from 'react';
import {IManager} from "../../../interfaces/manager/IManager";
import ManagersListItemComponent from "./ManagersListItemComponent";

interface IProps {
    managers: IManager[];
    refreshManagers: () => void;
}

const ManagersListComponent: FC<IProps> = ({managers, refreshManagers}) => {
    return (
        <div className="m-3 w-75">
            {managers.map(manager => <ManagersListItemComponent key={manager.id} manager={manager} refreshManagers={refreshManagers}/>)}
        </div>
    );
};

export default ManagersListComponent;