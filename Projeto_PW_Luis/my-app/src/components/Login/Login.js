import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css"; 
import biblioteca from "../assets/bibliotecas.png"; 

const LoginForm = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (data) => login(data);

    const login = (data) => {
        fetch("/auth/login", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({  
                nome: data.nome,
                password: data.password,
            }),
        })
        .then((r) => {
            if (!r.ok) {
                return r.json().then((error) => { throw new Error(error.message || 'Login failed'); });
            }
            return r.json();
        })
        .then((response) => {
            if (response.auth) {
                localStorage.setItem('token', response.token); // Store the token
                setLoginSuccess(true);
            } else {
                setErrorMessage("Login failed");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            setErrorMessage(error.message);
        });
    };

    useEffect(() => {
        if (loginSuccess) {
            navigate("/livro");
            console.log("Login successful, navigating to /livro");
        }
    }, [loginSuccess, navigate]);

    useEffect(() => {
        console.log("Component rendered");
    }, []);

    return (
        <div 
            className={styles.loginContainer}
            style={{ backgroundImage: `url(${biblioteca})` }} 
        >
            <div className={styles.login}>
                <h2>Login Form</h2>
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                <form className={styles.formLogin} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.field}>
                        <label>Nome:</label>
                        <input
                            type="nome"
                            {...register("nome", { required: "Name is required" })}
                        />
                        {errors.nome && <p className={styles.error}>{errors.nome.message}</p>}
                    </div>
                    <div className={styles.field}>
                        <label>Password:</label>
                        <input
                            type="password"
                            {...register("password", { required: "Password is required" })}
                        />
                        {errors.password && <p className={styles.error}>{errors.password.message}</p>}
                    </div>
                    <div className={styles.buttonContainer}>
                        <input className={styles.button} type="submit" value="Login" />
                        <Link to="/register" className={styles.button}>
                            Registar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
