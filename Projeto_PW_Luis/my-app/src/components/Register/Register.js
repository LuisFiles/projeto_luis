import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

const RegisterForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (data) => registerUser(data);

    const registerUser = (data) => {
        fetch("/auth/registo", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                nome: data.nome,
                email: data.email,
                password: data.password,
            }),
        })
        .then(async (response) => {
            const body = await response.json();
            console.log("Response Status:", response.status);
            console.log("Response Body:", body);

            if (response.ok && body.success) {
                setRegisterSuccess(true);
            } else {
                setErrorMessage(body.message || "Registration failed");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            setErrorMessage("An unexpected error occurred. Please try again later.");
        });
    };

    useEffect(() => {
        if (registerSuccess) {
            navigate("/");
            console.log("Registration successful, navigating to /login");
        }
    }, [registerSuccess, navigate]);

    useEffect(() => {
        console.log("Component rendered");
    }, []);

    return (
        <div className={styles.register}>
            <h2>Register Form</h2>
            {errorMessage && <p className={styles.error}>{errorMessage}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label>Nome:</label>
                    <input
                        type="text"
                        {...register("nome", { required: "Name is required" })}
                    />
                    {errors.nome && <p className={styles.error}>{errors.nome.message}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label>Email:</label>
                    <input
                        type="email"
                        {...register("email", { required: "Email is required" })}
                    />
                    {errors.email && <p className={styles.error}>{errors.email.message}</p>}
                </div>
                <div className={styles.formGroup}>
                    <label>Password:</label>
                    <input
                        type="password"
                        {...register("password", { required: "Password is required" })}
                    />
                    {errors.password && <p className={styles.error}>{errors.password.message}</p>}
                </div>
                <div className={styles.buttonContainer}>
                    <button type="submit">Register</button>
                    <button type="button" onClick={() => navigate("/")}>
                        Voltar para Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
