import React, {FC} from "react";
import {Button, Modal} from "react-bootstrap";
import {Control, Controller} from "react-hook-form";
import {ICreateManagerRequest} from "../../interfaces/manager/ICreateManagerRequest";
import ErrorComponent from "../ErrorComponent";

export interface IProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    control: Control<ICreateManagerRequest>;
    error: string | null;
}

export const CreateManagerModalComponent: FC<IProps> = ({isOpen, onClose, onSubmit, control, error}) => {
    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton/>
            <Modal.Body>
                <ErrorComponent error={error} />
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label>email</label>
                        <Controller
                            name="email"
                            control={control}
                            render={({field}) => (
                                <input {...field} type="email" className="form-control" required/>
                            )}
                        />
                    </div>
                    <div className="mb-3">
                        <label>name</label>
                        <Controller
                            name="name"
                            control={control}
                            render={({field}) => (
                                <input {...field} className="form-control" required/>
                            )}
                        />
                    </div>
                    <div className="mb-3">
                        <label>surname</label>
                        <Controller
                            name="surname"
                            control={control}
                            render={({field}) => (
                                <input {...field} className="form-control" required/>
                            )}
                        />
                    </div>
                    <Button type="submit" className="btn btn-success">create</Button>
                </form>
            </Modal.Body>
        </Modal>
    );
};
