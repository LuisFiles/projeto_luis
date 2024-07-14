import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AdicionaLivroLogica from './adicionaLivroLogica'; // Correct import
import './adicionaLivro.css';

const AdicionaLivro = () => {
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

    if (userLogged === null) {
        return <div>Loading...</div>;
    }

    const handleReserve = () => {
        navigate('/livro');
    };

    return (
        <div className='ReservaForm'>
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
                <Link to="/livro">Voltar</Link>
                {userLogged ? (
                    <>
                      <button onClick={handleReserve} className="action-button">Voltar</button>
                    </>
                ) : (
                    <>
                    </>
                )}
            </div>
            <label>Livros:</label>
            <div className='player-container'>
                <AdicionaLivroLogica url={location} />
            </div>
        </div>
    );
};

export default AdicionaLivro;
