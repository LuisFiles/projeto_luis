import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import LivroLogica from './livroLogica';
import './livro.css';

const Livros = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userLogged, setUserLogged] = useState(null);

    useEffect(() => {
        fetch('/auth/me', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            setUserLogged(response.auth);
        })
        .catch(error => {
            console.error('Error fetching /auth/me:', error);
            setUserLogged(false);
        });
    }, []);

    useEffect(() => {
        if (userLogged === false) {
            navigate('/');
        }
    }, [userLogged, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserLogged(false);
        navigate('/');
    };

    const handleReserve = () => {
        navigate('/reserva');
    };

    const handleAdicionaLivro = () => {
        navigate('/adicionaLivro');
    };


    if (userLogged === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className='Livro'>
            <div className='links'>
                <Link to="/">Logout</Link>
                {userLogged ? (
                    <>
                        <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
                    </>
                ) : (
                    <>
                    </>
                )}
                <Link to="/reserva">Reserva</Link>
                {userLogged ? (
                    <>
                      <button onClick={handleReserve} className="action-button">Reservar</button>
                    </>
                ) : (
                    <>
                    </>
                )}
                <Link to="/adicionaLivro">Adicionar Livro</Link>
                {userLogged ? (
                    <>
                      <button onClick={handleAdicionaLivro} className="action-button">Adicionar Livro</button>
                    </>
                ) : (
                    <>
                    </>
                )}
            </div>
            <label>Livros:</label>
            <div className='player-container'>
                <LivroLogica url={location} />
            </div>
        </div>
    );
};

export default Livros;
