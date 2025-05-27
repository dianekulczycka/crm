import React, {FC} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {ISearchParams} from "../../interfaces/order/ISearchParams";
import dayjs from "dayjs";
import {Button} from "react-bootstrap";

interface IProps {
    groups: string[];
    onFilterChange: (filters: Partial<ISearchParams>) => void;
    onExport: () => void;
}

export const FilterFormComponent: FC<IProps> = ({groups, onFilterChange, onExport}) => {
    const {register, handleSubmit} = useForm<Partial<ISearchParams>>();

    const onSearch: SubmitHandler<Partial<ISearchParams>> = (data) => {
        const formattedData = {
            ...data,
            startDate: data.startDate ? dayjs(data.startDate).format('YYYY-MM-DD') : undefined,
            endDate: data.endDate ? dayjs(data.endDate).format('YYYY-MM-DD') : undefined,
        };
        onFilterChange(formattedData);
    };

    return (
        <form onSubmit={handleSubmit(onSearch)}>
            <div className="d-flex flex-column">
                <div className="d-flex flex-row">
                    <input {...register("name")} placeholder="Name" className="form-control m-2"/>
                    <input {...register("surname")} placeholder="Surname" className="form-control m-2"/>
                    <input {...register("email")} placeholder="Email" className="form-control m-2"/>
                    <input {...register("phone")} placeholder="Phone" className="form-control m-2"/>

                    <select {...register("status")} className="form-select m-2">
                        <option value="">Status</option>
                        <option value="new">New</option>
                        <option value="in work">In Work</option>
                        <option value="agreed">Agreed</option>
                        <option value="disagreed">Disagreed</option>
                        <option value="dubbing">Dubbing</option>
                    </select>

                    <div className="form-check m-2">
                        <input
                            {...register("isAssignedToMe")}
                            type="checkbox"
                            className="form-check-input"
                            id="isAssignedToMe"
                        />
                        <label className="form-check-label" htmlFor="isAssignedToMe">My</label>
                    </div>
                </div>

                <div className="d-flex flex-row">
                    <select {...register("course")} className="form-select m-2">
                        <option value="">Course</option>
                        <option value="fs">FS</option>
                        <option value="qacx">QACX</option>
                        <option value="jcx">JCX</option>
                        <option value="jscx">JSCX</option>
                        <option value="fe">FE</option>
                        <option value="pcx">PCX</option>
                    </select>

                    <select {...register("courseFormat")} className="form-select m-2">
                        <option value="">Course format</option>
                        <option value="static">static</option>
                        <option value="online">online</option>
                    </select>

                    <select {...register("courseType")} className="form-select m-2">
                        <option value="">Course type</option>
                        <option value="pro">pro</option>
                        <option value="minimal">minimal</option>
                        <option value="premium">premium</option>
                        <option value="incubator">incubator</option>
                        <option value="vip">vip</option>
                    </select>

                    <select {...register("groupName")} className="form-select m-2">
                        <option value="">Group</option>
                        {groups.map((group) => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>

                    <input {...register("startDate")} type="date" className="form-control m-2"/>
                    <input {...register("endDate")} type="date" className="form-control m-2"/>
                    <Button type="submit" className="btn btn-success m-2">Search</Button>
                    <Button type="button" onClick={onExport} className="btn btn-success m-2">Excel</Button>
                </div>
            </div>
        </form>
    );
}

export default FilterFormComponent;