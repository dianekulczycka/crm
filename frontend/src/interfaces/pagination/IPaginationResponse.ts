export interface IPaginationResponse<T> {
    total: number;
    perPage: number;
    nextPage: number | null;
    prevPage: number | null;
    data: T[];
}