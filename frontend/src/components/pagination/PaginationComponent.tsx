import {FC} from "react";
import ReactPaginate from "react-paginate";

interface IProps {
    total: number;
    perPage: number;
    page: number;
    setPage?: (page: number) => void;
    setSearchParams?: (params: any) => void;
}

const PaginationComponent: FC<IProps> = ({total, perPage, page, setSearchParams, setPage}) => {

    const onPageChange = (selectedPage: { selected: number }) => {
        const newPage = selectedPage.selected + 1;
        if (setSearchParams) {
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.set("page", String(newPage));
            setSearchParams(Object.fromEntries(currentParams.entries()));
        } else if (setPage) {
            setPage(newPage);
        }
    };

    return (
        <div className="p-lg-1">
            <ReactPaginate
                pageCount={Math.ceil(total / perPage)}
                pageRangeDisplayed={7}
                marginPagesDisplayed={1}
                onPageChange={onPageChange}
                forcePage={page - 1}
                containerClassName="pagination justify-content-center"
                pageClassName="page-item m-1"
                pageLinkClassName="page-link btn rounded-circle btn-outline-secondary text-secondary"
                previousClassName="page-item m-1"
                previousLinkClassName="page-link btn rounded-circle btn-outline-secondary text-secondary"
                nextClassName="page-item m-1"
                nextLinkClassName="page-link btn rounded-circle btn-outline-secondary text-secondary"
                breakClassName="page-item m-1"
                breakLinkClassName="page-link btn rounded-circle btn-outline-secondary text-secondary"
                previousLabel="<"
                nextLabel=">"
            />
        </div>
    );
};

export default PaginationComponent;