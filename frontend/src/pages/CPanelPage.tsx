import {FC, useEffect, useState} from "react";
import {IStat} from "../interfaces/order/IStat";
import {getStats} from "../services/ordersService";
import PreloaderComponent from "../components/PreloaderComponent";
import CPanelComponent from "../components/cpanel/CPanelComponent";
import {IManager} from "../interfaces/manager/IManager";
import {getManagers} from "../services/managerService";
import PaginationComponent from "../components/pagination/PaginationComponent";

const CPanelPage: FC = () => {
    const [stats, setStats] = useState<IStat[]>([]);
    const [managers, setManagers] = useState<IManager[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);
    const [perPage, setPerPage] = useState<number>(0);

    useEffect((): void => {
        setIsLoaded(false);
        getStats()
            .then((data) => {
                setStats(data);
                setIsLoaded(true);
            })
    }, []);

    useEffect((): void => {
        setIsLoaded(false);
        getManagers({page})
            .then((data) => {
                setManagers(data.data);
                setTotal(data.total);
                setPerPage(data.perPage);
                setIsLoaded(true);
            })
    }, [page]);

    return (
        <div className="d-flex flex-column align-items-center justify-content-evenly p-4 w-100">
            {isLoaded ?
                <>
                    <CPanelComponent managers={managers} stats={stats}/>
                    <PaginationComponent total={total}
                                         perPage={perPage} page={page}
                                         setPage={(newPage: number) => setPage(newPage)} />
                </>
                :
                <PreloaderComponent/>
            }
        </div>
    );
};

export default CPanelPage;