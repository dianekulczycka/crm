import React, {FC, useEffect, useState} from "react";
import {IStat} from "../interfaces/order/IStat";
import {getStats} from "../api/ordersService";
import PreloaderComponent from "../components/PreloaderComponent";
import CPanelComponent from "../components/cpanel/CPanelComponent";
import {IManager} from "../interfaces/manager/IManager";
import {getManagers} from "../api/managerService";
import PaginationComponent from "../components/pagination/PaginationComponent";
import {useSearchParams} from "react-router-dom";
import ErrorComponent from "../components/ErrorComponent";
import {getUserRole} from "../api/utils/tokenUtil";

const CPanelPage: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [stats, setStats] = useState<IStat[]>([]);
    const [managers, setManagers] = useState<IManager[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [perPage, setPerPage] = useState<number>(0);
    const page = Number(searchParams.get("page")) || 1;

    const role = getUserRole();
    const isAdmin = role === "ROLE_ADMIN";

    useEffect(() => {
        if (!searchParams.has("page")) {
            setSearchParams({...Object.fromEntries(searchParams.entries()), page: "1"});
        }
    }, []);

    useEffect((): void => {
        setIsLoaded(false);
        getStats()
            .then((stats) => {
                setStats(stats);
                setIsLoaded(true);
            })
            .catch((error) => {
                setError(error);
                setIsLoaded(true);
            });
    }, []);

    const loadManagers = () => {
        setIsLoaded(false);
        getManagers({page})
            .then((resp) => {
                setManagers(resp.data);
                setTotal(resp.total);
                setPerPage(resp.perPage);
                setIsLoaded(true)
            })
            .catch((error) => {
                setError(error.message);
                setIsLoaded(true)
            })
    };

    useEffect(() => {
        loadManagers();
    }, [page]);

    const refreshManagers = () => {
        loadManagers();
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-evenly p-4 w-100">
            <ErrorComponent error={error}/>
            {!isLoaded ? (
                <PreloaderComponent/>
            ) : !isAdmin ? (
                <p className="text-danger">only admin can view</p>
            ) : (
                <>
                    <CPanelComponent refreshManagers={refreshManagers} managers={managers} stats={stats}/>
                    <PaginationComponent
                        total={total}
                        perPage={perPage}
                        page={page}
                        setSearchParams={setSearchParams}
                    />
                </>
            )}
        </div>
    );
}

export default CPanelPage;