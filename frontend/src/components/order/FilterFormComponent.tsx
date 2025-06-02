import React, {FC, useEffect} from "react";
import {useForm} from "react-hook-form";
import dayjs from "dayjs";
import {Button} from "react-bootstrap";
import {useDebounce} from "use-debounce";
import {IFilter} from "../../interfaces/order/IFilter";

interface IProps {
    groups: string[];
    onFilterChange: (filters: Partial<IFilter>) => void;
    onExport: () => void;
    defaultValues: Partial<IFilter>;
}

export const FilterFormComponent: FC<IProps> = ({groups, onFilterChange, onExport, defaultValues}) => {
    const {register, watch, reset} = useForm<Partial<IFilter>>({defaultValues});
    const watchedValues = watch();
    const [debouncedFilters] = useDebounce(watchedValues, 1000);

    useEffect(() => {
        const formattedData = {
            ...debouncedFilters,
            startDate: debouncedFilters.startDate
                ? dayjs(debouncedFilters.startDate).format("YYYY-MM-DD")
                : undefined,
            endDate: debouncedFilters.endDate
                ? dayjs(debouncedFilters.endDate).format("YYYY-MM-DD")
                : undefined,
        };
        onFilterChange(formattedData);
    }, [debouncedFilters]);

    const onReset = () => {
        reset({});
        onFilterChange({});
    };

    return (
        <form>
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
                    <Button type="button" onClick={onExport} className="btn btn-success m-2">excel</Button>
                    <Button type="button" onClick={onReset} className="btn btn-success m-2">reset</Button>
                </div>
            </div>
        </form>
    );
}

export default FilterFormComponent;