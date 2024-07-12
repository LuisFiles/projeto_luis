import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import LivroLogica from './livroLogica';
import './livro.css';

const Livros = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userLogged, setUserLogged] = useState(null);


    const OnClickLogout = () => {
        fetch('/auth/logout', {
            headers: { 'Accept': 'application/json'}
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.logout){
                setUserLogged(false);
            }
        })
        .catch(() => {
            setUserLogged(false);
        })
    }

    useEffect(() => {
        // Include an authorization header if required by your backend
        fetch('/auth/me', {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust as per your token storage method
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

    if (userLogged === null) {
        // Optionally, you can show a loading spinner or message here
        return <div>Loading...</div>;
    }

    return (
        <div className='Livro'>
            <div className='links'>
                <Link to="/">HomePage</Link>
            </div>
            <label>Livros:</label>
            <div className='player-container'>
                <LivroLogica url={location} />
            </div>
            <button className="buttons" onClick={OnClickLogout}> Logout </button>
        </div>
    );
};

export default Livros;
