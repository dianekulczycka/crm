import {FC, useState} from "react";
import TableHeaderComponent from "./TableHeaderComponent";
import OrderComponent from "./OrderComponent";
import {IOrder} from "../../interfaces/order/IOrder";

interface IProps {
    orders: IOrder[];
    groups: string[];
    onSort: (column: string) => void;
    refreshOrders: () => void
}

const OrdersComponent: FC<IProps> = ({orders, groups, onSort, refreshOrders}) => {
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const toggleExpand = (orderId: number) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <div>
            <table className="table table-bordered table-striped">
                <TableHeaderComponent onSort={onSort}/>
                <tbody>
                {orders.map((order, index) => (
                    <OrderComponent
                        key={index}
                        order={order}
                        groups={groups}
                        isExpanded={expandedOrderId === order.id}
                        onClick={() => toggleExpand(order.id)}
                        refreshOrders={refreshOrders}
                    />
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersComponent;
