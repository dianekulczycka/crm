import React, {FC, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {login} from "../../api/authService";
import {Button} from "react-bootstrap";

interface IFormData {
    email: string;
    password: string;
}

const AuthFormComponent: FC = () => {
    const [error, setError] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<IFormData>();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<IFormData> = (data) => {
        login(data)
            .then(() => {
                navigate("/orders?page=1&order=id&direction=desc");
            })
            .catch((error) => {
                setError(error.message);
            });
    };


    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                <input
                    {...register("email", {
                        required: "email required",
                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i
                    })}
                    className="m-2"
                    type="email"
                    placeholder={"email"}
                />
                {errors.email && <span className="text-danger">{errors.email.message}</span>}

                <input
                    {...register("password", {required: "password required"})}
                    className="m-2"
                    type="password"
                    placeholder={"password"}
                />
                {errors.password && <span className="text-danger">{errors.password.message}</span>}

                <Button type="submit" className="btn btn-success m-2">Login</Button>
            </form>
        </div>
    );
};

export default AuthFormComponent;