import Livro from './livroLogica';
import './livro.css';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import config from '../config'; 
import LivroLogica from './livroLogica';

const Livros = () => {
    let navigate = useNavigate();
    let location = useLocation();
    const [userLogged, setUserLogged] = useState(true);

    useEffect(() => {
        fetch('/auth/me', {
            headers: { 'Accept': 'application/json'}
        })
        .then((response) => response.json())
        .then((response) => {
            setUserLogged(response.auth);
        })
        .catch(() => {
            setUserLogged(false);
        })
    }, [])

if(!userLogged){
    navigate('/');
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
            
        </div>
    );
}
export default Livros;
