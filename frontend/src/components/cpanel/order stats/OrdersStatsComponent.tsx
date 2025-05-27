import React, {FC} from 'react';
import {IStat} from "../../../interfaces/order/IStat";
import OrderStatsItemComponent from "./OrderStatsItemComponent";

interface IProps {
    stats: IStat[];
}

const OrdersStatsComponent: FC<IProps> = ({stats}) => {
    return (
        <div className="d-flex flex-column justify-content-evenly w-100 mx-5">
            <h3>Orders:</h3>
            {stats.length > 0 ? (
                <ul className="list-unstyled">
                    {stats.map((stat, index) => <OrderStatsItemComponent key={index} stat={stat}/>)}
                </ul>
            ) : (
                <h3 className="text-danger">No stats</h3>
            )}
        </div>
    );
};

export default OrdersStatsComponent;