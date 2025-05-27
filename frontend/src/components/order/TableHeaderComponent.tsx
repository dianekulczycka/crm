import {FC} from "react";

interface IProps {
    onSort: (column: string) => void;
}

const TableHeaderComponent: FC<IProps> = ({onSort}) => {
    return (
        <thead>
        <tr>
            <th onClick={() => onSort("id")}>ID</th>
            <th onClick={() => onSort("name")}>Name</th>
            <th onClick={() => onSort("surname")}>Surname</th>
            <th onClick={() => onSort("email")}>Email</th>
            <th onClick={() => onSort("phone")}>Phone</th>
            <th onClick={() => onSort("age")}>Age</th>
            <th onClick={() => onSort("course")}>Course</th>
            <th onClick={() => onSort("courseFormat")}>Course Format</th>
            <th onClick={() => onSort("courseType")}>Course Type</th>
            <th onClick={() => onSort("status")}>Status</th>
            <th onClick={() => onSort("sum")}>Sum</th>
            <th onClick={() => onSort("alreadyPaid")}>Already Paid</th>
            <th onClick={() => onSort("createdAt")}>Created At</th>
            <th onClick={() => onSort("manager")}>Manager</th>
            <th onClick={() => onSort("group")}>Group</th>
        </tr>
        </thead>
    );
};

export default TableHeaderComponent;