import React, {FC} from 'react';
import {IStat} from "../../../interfaces/order/IStat";

interface IProps {
    stat: IStat;
}

const OrderStatsItemComponent: FC<IProps> = ({stat}) => {
    return (
        <li className="list-group-item d-flex justify-content-between">
            <h5>{stat.name}: {stat.count}</h5>
        </li>
    );
};

export default OrderStatsItemComponent;