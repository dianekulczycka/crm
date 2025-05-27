export interface ISearchParams {
    page: number;
    order?: string;
    direction?: string;
    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    course?: string;
    courseFormat?: string;
    courseType?: string;
    status?: string;
    groupName?: string;
    startDate?: string;
    endDate?: string;
    isAssignedToMe?: boolean;
}