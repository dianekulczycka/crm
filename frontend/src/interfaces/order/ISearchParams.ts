import {IFilter} from "./IFilter";
import {ISort} from "./ISort";

export type ISearchParams = { page: number } & IFilter & ISort;