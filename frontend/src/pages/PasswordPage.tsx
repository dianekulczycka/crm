import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {SubmitHandler, useForm} from "react-hook-form";
import {IPasswordUpdate} from "../interfaces/auth/IPasswordUpdate";
import {setManagerPassword} from "../services/authService";


const PasswordPage = () => {
    const navigate = useNavigate();
    const {token} = useParams();
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm<IPasswordUpdate>();

    const onSubmit: SubmitHandler<IPasswordUpdate> = async (data) => {
        try {
            await setManagerPassword(token!, data);
            alert("Password was set. You can now log in using it");
            localStorage.clear();
            navigate("/");
        } catch (error) {
            console.error("Password setting failed", error);
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <h1 className="text-success m-4">Set Your Password</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column">
                <input
                    type="password"
                    placeholder="Password"
                    {...register("password", {required: true, minLength: 6})}
                    className="border p-2 m-2"
                />
                {errors.password && <span className="text-red-500">password is required (min 6)</span>}

                <input
                    type="password"
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                        validate: (value) => value === watch("password") || "Passwords do not match",
                    })}
                    className="border p-2 m-2"
                />
                {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}

                <button type="submit" className="m-2 p-2 bg-success text-white">
                    submit
                </button>
            </form>
        </div>
    );
};

export default PasswordPage;