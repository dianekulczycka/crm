import {FC, useEffect, useState} from "react";
import OrdersComponent from "../components/order/OrdersComponent";
import PaginationComponent from "../components/pagination/PaginationComponent";
import PreloaderComponent from "../components/PreloaderComponent";
import {useNavigate, useSearchParams} from "react-router-dom";
import {getAllGroupNames, getAllOrders, getExcel} from "../services/ordersService";
import {IPaginationResponse} from "../interfaces/pagination/IPaginationResponse";
import {IOrder} from "../interfaces/order/IOrder";
import {ISearchParams} from "../interfaces/order/ISearchParams";
import FilterFormComponent from "../components/order/FilterFormComponent";
import {saveAs} from "file-saver";
import dayjs from "dayjs";

const OrdersPage: FC = () => {
    useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const [ordersPaginated, setOrdersPaginated] = useState<IOrder[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(0);

    const page = Number(searchParams.get("page")) || 1;
    const order = searchParams.get("order") || "id";
    const direction = searchParams.get("direction") || "desc";

    const queryParams: ISearchParams = {
        page,
        order,
        direction,
        name: searchParams.get("name") || undefined,
        surname: searchParams.get("surname") || undefined,
        email: searchParams.get("email") || undefined,
        phone: searchParams.get("phone") || undefined,
        course: searchParams.get("course") || undefined,
        courseFormat: searchParams.get("courseFormat") || undefined,
        courseType: searchParams.get("courseType") || undefined,
        status: searchParams.get("status") || undefined,
        groupName: searchParams.get("groupName") || undefined,
        startDate: searchParams.get("startDate") || undefined,
        endDate: searchParams.get("endDate") || undefined,
        isAssignedToMe: searchParams.get("isAssignedToMe") === "true" || undefined,
    };

    useEffect((): void => {
        setIsLoaded(false);
        getAllOrders(queryParams)
            .then((resp: IPaginationResponse<IOrder>) => {
                setOrdersPaginated(resp.data);
                setTotal(resp.total);
                setPerPage(resp.perPage);
                setIsLoaded(true);
            })
    }, [searchParams]);

    useEffect((): void => {
        getAllGroupNames()
            .then((groups: string[]) => setGroups(groups.map(g => g.toUpperCase())))
            .catch(error => console.error("Error fetching groups", error));
    }, [setGroups]);

    const onFilterChange = (filters: Partial<ISearchParams>) => {
        const formattedParams: { [key: string]: string } = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === "string") {
                const trim = value.trim().toLowerCase();
                if (trim) formattedParams[key] = trim;
            } else if (typeof value === "boolean" && value) {
                formattedParams[key] = "true";
            }
        });

        setSearchParams(formattedParams);
    };

    const updateSorting = (newOrder: string): void => {
        const newDirection: string =
            queryParams.order === newOrder && queryParams.direction === "asc" ? "desc" : "asc";

        setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            order: newOrder,
            direction: newDirection
        });
    };

    const onExportToExcel = (): void => {
        const filters: { [key: string]: string | boolean | null } = {};

        searchParams.forEach((value, key) => {
            if (!["page", "order", "direction"].includes(key)) {
                if (value === "") {
                    filters[key] = null;
                } else if (value === "true" || value === "false") {
                    filters[key] = value === "true";
                } else {
                    filters[key] = value;
                }
            }
        });

        getExcel(filters)
            .then(response => {
                saveAs(response, `orders ${dayjs().format("DD.MM.YY")}.xlsx`);
            })
            .catch(error => console.error("Export error", error));
    };

    return (
        <div>
            {isLoaded ? (
                <div className="d-flex flex-column align-items-center justify-content-evenly">
                    <FilterFormComponent
                        groups={groups}
                        onFilterChange={onFilterChange}
                        onExport={onExportToExcel}
                    />

                    {ordersPaginated.length > 0 ? (
                        <>
                            <OrdersComponent
                                orders={ordersPaginated}
                                groups={groups}
                                onSort={updateSorting}
                            />
                            <PaginationComponent
                                total={total}
                                perPage={perPage}
                                page={page}
                                setSearchParams={setSearchParams}
                            />
                        </>
                    ) : (
                        <h3 className="mt-4 text-danger">No orders</h3>
                    )}
                </div>
            ) : (
                <PreloaderComponent/>
            )}
        </div>
    );
};

export default OrdersPage;