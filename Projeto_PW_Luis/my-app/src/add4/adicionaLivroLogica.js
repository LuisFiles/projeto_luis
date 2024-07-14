import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import './adicionaLivroLogica.css';

const AdicionaLivroLogica = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [addSuccess, setAddSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (data) => {
        fetch('/api/livro', { // Corrected endpoint to /livro
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw new Error(error.message || 'Failed to add book'); });
            }
            return response.json();
        })
        .then(response => {
            setAddSuccess(true);
        })
        .catch(error => {
            console.error("Error:", error);
            setErrorMessage(error.message);
        });
    };

    if (addSuccess) {
        navigate('/livro');
    }

    return (
        <div className="form-container">
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <h2>Adicionar Livro</h2>
                {errorMessage && <p className="error">{errorMessage}</p>}
                <div className="form-group">
                    <label htmlFor="titulo">Título</label>
                    <input
                        type="text"
                        id="titulo"
                        {...register("titulo", { required: "Título é obrigatório" })}
                    />
                    {errors.titulo && <p className="error">{errors.titulo.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="autor">Autor</label>
                    <input
                        type="text"
                        id="autor"
                        {...register("autor", { required: "Autor é obrigatório" })}
                    />
                    {errors.autor && <p className="error">{errors.autor.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="ano">Ano</label>
                    <input
                        type="number"
                        id="ano"
                        {...register("ano", { required: "Ano é obrigatório" })}
                    />
                    {errors.ano && <p className="error">{errors.ano.message}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="categoria">Categoria</label>
                    <input
                        type="text"
                        id="categoria"
                        {...register("categoria", { required: "Categoria é obrigatória" })}
                    />
                    {errors.categoria && <p className="error">{errors.categoria.message}</p>}
                </div>
                <button type="submit">Adicionar Livro</button>
            </form>
        </div>
    );
};

export default AdicionaLivroLogica;
