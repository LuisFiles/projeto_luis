import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import LivroLogica from './add/livroLogica'; 
import Livro from './add/livro';
import './App.css';

const App = () => {
    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/" element={<LivroLogica />} /> 
                    <Route path="/livro" element={<Livro />} /> 
                </Routes>
            </div>
        </Router>
    );
}

export default App;
